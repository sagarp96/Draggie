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
  const maxReconnectAttempts = 5;
  const currentChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(
    null
  );

  const setupChannel = useCallback(() => {
    // Clean up existing channel
    if (currentChannelRef.current) {
      supabase.removeChannel(currentChannelRef.current);
      currentChannelRef.current = null;
    }

    const newChannel = supabase.channel(roomName, {
      config: {
        broadcast: { self: true },
        presence: { key: username },
      },
    });

    newChannel
      .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
        console.log("Received message:", payload);
        setMessages((current) => [...current, payload.payload as ChatMessage]);
      })
      .subscribe(async (status, err) => {
        console.log("Channel status:", status, err);

        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          reconnectAttemptsRef.current = 0;
          console.log("Successfully connected to chat channel");
        } else if (status === "CHANNEL_ERROR") {
          setIsConnected(false);
          console.error("Channel error:", err);

          // Attempt to reconnect with exponential backoff
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            const delay = Math.pow(2, reconnectAttemptsRef.current) * 1000;
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectAttemptsRef.current++;
              console.log(
                `Reconnecting to chat... Attempt ${reconnectAttemptsRef.current}`
              );
              setupChannel();
            }, delay);
          }
        } else if (status === "CLOSED") {
          setIsConnected(false);
          console.log("Channel closed");
        }
      });

    currentChannelRef.current = newChannel;
  }, [roomName, username]);
  useEffect(() => {
    setupChannel();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (currentChannelRef.current) {
        supabase.removeChannel(currentChannelRef.current);
        currentChannelRef.current = null;
      }
    };
  }, [setupChannel]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentChannelRef.current || !isConnected) {
        console.warn("Cannot send message: channel not connected");
        return;
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
        // Update local state immediately for the sender
        setMessages((current) => [...current, message]);

        await currentChannelRef.current.send({
          type: "broadcast",
          event: EVENT_MESSAGE_TYPE,
          payload: message,
        });

        console.log("Message sent successfully");
      } catch (error) {
        console.error("Error sending message:", error);
        // Remove the message from local state if sending failed
        setMessages((current) => current.filter((m) => m.id !== message.id));
      }
    },
    [isConnected, username]
  );

  return { messages, sendMessage, isConnected };
}
