import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Custom hook to subscribe to Server-Sent Events (SSE) telemetry stream
 * @param {string} endpoint - The SSE endpoint (defaults to /api/v1/stream)
 * @param {Object} options - Options including event handlers and enabled flag
 */
export const useSSE = (endpoint = '/api/v1/stream', options = {}) => {
  const { enabled = true, onMessage, onAlert, onCrowdUpdate } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const fullUrl = `${baseUrl}${endpoint}`;

    try {
      const eventSource = new EventSource(fullUrl);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setLastEvent({ type: 'message', data: parsed, timestamp: new Date() });
          onMessage?.(parsed);
        } catch {
          // Non-JSON ping
        }
      };

      eventSource.addEventListener('crowd_update', (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setLastEvent({ type: 'crowd_update', data: parsed, timestamp: new Date() });
          onCrowdUpdate?.(parsed);
        } catch {
          // ignore parsing error
        }
      });

      eventSource.addEventListener('new_alert', (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setLastEvent({ type: 'new_alert', data: parsed, timestamp: new Date() });
          onAlert?.(parsed);
        } catch {
          // ignore parsing error
        }
      });

      eventSource.onerror = () => {
        setIsConnected(false);
        setConnectionError('Connection lost. Reconnecting...');
        eventSource.close();
        // Exponential backoff reconnect
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      };
    } catch (err) {
      setIsConnected(false);
      setConnectionError(err.message);
    }
  }, [enabled, endpoint, onMessage, onAlert, onCrowdUpdate]);

  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [enabled, connect]);

  return { isConnected, lastEvent, connectionError };
};

export default useSSE;
