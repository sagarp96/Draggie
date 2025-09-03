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

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 3; // Reduced for production
  const currentChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(
    null
  );
  const isSetupInProgressRef = useRef(false);

  const setupChannel = useCallback(() => {
    // Prevent multiple simultaneous setup attempts
    if (isSetupInProgressRef.current) {
      console.log("Channel setup already in progress, skipping");
      return;
    }

    isSetupInProgressRef.current = true;

    // Clean up existing channel
    if (currentChannelRef.current) {
      try {
        supabase.removeChannel(currentChannelRef.current);
      } catch (error) {
        console.warn("Error removing existing channel:", error);
      }
      currentChannelRef.current = null;
    }

    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = undefined;
    }

    try {
      const newChannel = supabase.channel(`room:${roomName}`, {
        config: {
          broadcast: { self: false }, // Don't receive our own messages
          presence: { key: username },
        },
      });

      newChannel
        .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
          console.log("Received message:", payload);
          if (payload.payload) {
            setMessages((current) => [
              ...current,
              payload.payload as ChatMessage,
            ]);
          }
        })
        .subscribe(async (status, err) => {
          console.log("Channel status:", status, err);

          isSetupInProgressRef.current = false;

          if (status === "SUBSCRIBED") {
            setIsConnected(true);
            reconnectAttemptsRef.current = 0;
            console.log("Successfully connected to chat channel");
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            setIsConnected(false);
            console.error("Channel error:", err);

            // Only attempt reconnection if we haven't exceeded max attempts
            if (reconnectAttemptsRef.current < maxReconnectAttempts) {
              const delay = Math.min(
                Math.pow(2, reconnectAttemptsRef.current) * 1000,
                10000
              ); // Cap at 10 seconds
              console.log(`Will retry connection in ${delay}ms`);

              reconnectTimeoutRef.current = setTimeout(() => {
                reconnectAttemptsRef.current++;
                console.log(
                  `Reconnecting to chat... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`
                );
                setupChannel();
              }, delay);
            } else {
              console.error("Max reconnection attempts reached. Giving up.");
            }
          } else if (status === "CLOSED") {
            setIsConnected(false);
            console.log("Channel closed");
          }
        });

      currentChannelRef.current = newChannel;
    } catch (error) {
      console.error("Error setting up channel:", error);
      isSetupInProgressRef.current = false;
      setIsConnected(false);
    }
  }, [roomName, username]);
  useEffect(() => {
    setupChannel();

    return () => {
      console.log("Cleaning up realtime chat hook");
      isSetupInProgressRef.current = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = undefined;
      }

      if (currentChannelRef.current) {
        try {
          supabase.removeChannel(currentChannelRef.current);
        } catch (error) {
          console.warn("Error during channel cleanup:", error);
        }
        currentChannelRef.current = null;
      }

      setIsConnected(false);
    };
  }, [setupChannel]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentChannelRef.current || !isConnected) {
        console.warn("Cannot send message: channel not connected");
        return false;
      }

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        user: {
          name: username,
        },
        createdAt: new Date().toISOString(),
      };

      try {
        // Send message to channel first
        const result = await currentChannelRef.current.send({
          type: "broadcast",
          event: EVENT_MESSAGE_TYPE,
          payload: message,
        });

        if (result === "ok") {
          // Update local state after successful send
          setMessages((current) => [...current, message]);
          console.log("Message sent successfully");
          return true;
        } else {
          console.error("Failed to send message:", result);
          return false;
        }
      } catch (error) {
        console.error("Error sending message:", error);
        return false;
      }
    },
    [isConnected, username]
  );

  return { messages, sendMessage, isConnected };
}
