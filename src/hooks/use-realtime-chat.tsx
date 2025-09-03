"use client";

import { supabase } from "@/lib/supabase/client";
import { useCallback, useEffect, useState, useRef } from "react";

interface UseRealtimeChatProps {
  roomName: string;
  username: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  user: {
    name: string;
  };
  createdAt: string;
}

const EVENT_MESSAGE_TYPE = "message";
const MAX_RECONNECT_ATTEMPTS = 5;
const BASE_RECONNECT_DELAY = 1000; // 1 second
const MAX_RECONNECT_DELAY = 30000; // 30 seconds

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Calculate exponential backoff delay
  const getReconnectDelay = useCallback((attempt: number) => {
    const delay = Math.min(
      BASE_RECONNECT_DELAY * Math.pow(2, attempt),
      MAX_RECONNECT_DELAY
    );
    // Add some jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }, []);

  // Clean up existing channel
  const cleanupChannel = useCallback(() => {
    if (channelRef.current) {
      try {
        console.log("Cleaning up existing channel");
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.warn("Error cleaning up channel:", error);
      } finally {
        channelRef.current = null;
      }
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // Initialize or reconnect to channel
  const initializeChannel = useCallback(() => {
    if (isInitializingRef.current || !isMountedRef.current) {
      return;
    }

    isInitializingRef.current = true;
    cleanupChannel();

    try {
      console.log(
        `Initializing chat channel for room: ${roomName}, user: ${username}`
      );

      const channel = supabase.channel(`chat:${roomName}`, {
        config: {
          broadcast: {
            self: false, // Don't receive our own messages
            ack: true, // Request acknowledgment
          },
          presence: {
            key: username,
          },
        },
      });

      channel
        .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
          console.log("Received message:", payload);
          const message = payload.payload as ChatMessage;

          if (message && isMountedRef.current) {
            setMessages((current) => {
              // Prevent duplicate messages
              const exists = current.some((m) => m.id === message.id);
              if (exists) return current;

              return [...current, message];
            });
          }
        })
        .subscribe(async (status, error) => {
          console.log(`Channel subscription status: ${status}`, error);

          if (!isMountedRef.current) {
            return;
          }

          switch (status) {
            case "SUBSCRIBED":
              setIsConnected(true);
              setConnectionAttempts(0);
              console.log("Successfully connected to chat channel");
              break;

            case "CHANNEL_ERROR":
            case "TIMED_OUT":
              setIsConnected(false);
              console.error(`Channel ${status}:`, error);

              // Attempt reconnection with exponential backoff
              if (connectionAttempts < MAX_RECONNECT_ATTEMPTS) {
                const delay = getReconnectDelay(connectionAttempts);
                console.log(
                  `Reconnecting in ${delay}ms... (attempt ${
                    connectionAttempts + 1
                  }/${MAX_RECONNECT_ATTEMPTS})`
                );

                reconnectTimeoutRef.current = setTimeout(() => {
                  if (isMountedRef.current) {
                    setConnectionAttempts((prev) => prev + 1);
                    isInitializingRef.current = false;
                    initializeChannel();
                  }
                }, delay);
              } else {
                console.error("Max reconnection attempts reached");
                setConnectionAttempts(0); // Reset for potential future reconnections
              }
              break;

            case "CLOSED":
              setIsConnected(false);
              console.log("Channel closed");
              break;

            default:
              console.log(`Unhandled channel status: ${status}`);
          }

          isInitializingRef.current = false;
        });

      channelRef.current = channel;
    } catch (error) {
      console.error("Error initializing channel:", error);
      setIsConnected(false);
      isInitializingRef.current = false;

      // Retry after a delay if we haven't exceeded max attempts
      if (connectionAttempts < MAX_RECONNECT_ATTEMPTS) {
        const delay = getReconnectDelay(connectionAttempts);
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setConnectionAttempts((prev) => prev + 1);
            initializeChannel();
          }
        }, delay);
      }
    }
  }, [
    roomName,
    username,
    connectionAttempts,
    cleanupChannel,
    getReconnectDelay,
  ]);

  // Initialize channel on mount
  useEffect(() => {
    isMountedRef.current = true;
    initializeChannel();

    return () => {
      isMountedRef.current = false;
      isInitializingRef.current = false;
      cleanupChannel();
    };
  }, [initializeChannel, cleanupChannel]);

  // Send message function
  const sendMessage = useCallback(
    async (content: string): Promise<boolean> => {
      if (!channelRef.current || !isConnected || !content.trim()) {
        console.warn(
          "Cannot send message: channel not connected or content empty"
        );
        return false;
      }

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content: content.trim(),
        user: {
          name: username,
        },
        createdAt: new Date().toISOString(),
      };

      try {
        // Send to channel first
        const result = await channelRef.current.send({
          type: "broadcast",
          event: EVENT_MESSAGE_TYPE,
          payload: message,
        });

        if (result === "ok") {
          // Add to local state optimistically
          setMessages((current) => {
            // Prevent duplicates
            const exists = current.some((m) => m.id === message.id);
            if (exists) return current;

            return [...current, message];
          });
          console.log("Message sent successfully");
          return true;
        } else {
          console.error("Failed to send message, result:", result);
          return false;
        }
      } catch (error) {
        console.error("Error sending message:", error);
        return false;
      }
    },
    [isConnected, username]
  );

  // Manual reconnect function
  const reconnect = useCallback(() => {
    console.log("Manual reconnect requested");
    setConnectionAttempts(0);
    initializeChannel();
  }, [initializeChannel]);

  return {
    messages,
    sendMessage,
    isConnected,
    reconnect,
    connectionAttempts,
  };
}
