import { WS_URL } from "../../../../utils/config";
import { useState, useEffect, useRef, useCallback } from "react";

const useWebSocket = (chatId, onMessage) => {
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(() => {
    if (!chatId || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setIsConnecting(true);
    // Construct WebSocket URL properly - remove http:// and use ws://

    const wsUrl = `${WS_URL}/chat/${chatId}/`;

    console.log(`Connecting to WebSocket for chat ${chatId} at ${wsUrl}`);

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log(`WebSocket connected for chat ${chatId}`);
        setIsConnected(true);
        setIsConnecting(false);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log(
          `WebSocket closed for chat ${chatId}:`,
          event.code,
          event.reason
        );
        setIsConnected(false);
        setIsConnecting(false);

        // Reconnect after delay if it wasn't a manual close
        if (event.code !== 1000) {
          setTimeout(() => {
            if (chatId) connect();
          }, 3000);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error(`WebSocket error for chat ${chatId}:`, error);
        setIsConnecting(false);
      };
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      setIsConnecting(false);
    }
  }, [chatId, onMessage]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, "Component unmounting");
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (chatId) {
      connect();
    }
    return disconnect;
  }, [chatId, connect, disconnect]);

  return { isConnected, isConnecting, sendMessage, disconnect };
};

export default useWebSocket;
