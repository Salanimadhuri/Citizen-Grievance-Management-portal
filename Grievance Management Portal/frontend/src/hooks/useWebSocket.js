import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';

const WS_URL = (import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000')
  .replace('http://', 'ws://')
  .replace('https://', 'wss://');

export function useWebSocket(userId, onNotification) {
  const clientRef = useRef(null);

  const connect = useCallback(() => {
    if (!userId) return;

    const client = new Client({
      brokerURL: `${WS_URL}/ws`,
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/user/${userId}/queue/notifications`, (message) => {
          try {
            const notification = JSON.parse(message.body);
            onNotification?.(notification);
          } catch (e) {
            console.error('Failed to parse notification:', e);
          }
        });
      },
      onStompError: (frame) => {
        console.warn('STOMP error:', frame);
      },
    });

    client.activate();
    clientRef.current = client;
  }, [userId, onNotification]);

  useEffect(() => {
    connect();
    return () => {
      clientRef.current?.deactivate();
    };
  }, [connect]);
}
