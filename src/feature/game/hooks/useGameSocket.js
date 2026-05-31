import { API_BASE_URL } from '@core/constants';
import { resolveWebSocketURL } from '@core/helpers';
import { useEffect, useRef, useState } from 'react';

export function useGameSocket(gameId, token) {
  const [connected, setConnected] = useState(false);
  const [currentGameState, setCurrentGameState] = useState(null);
  const [mounted, setMounted] = useState(false);

  const reconnectTimeout = useRef(null);

  const webSocketRef = useRef(null);

  useEffect(() => {
    if (!gameId || !token || !mounted) return;

    function connect() {
      const url = new URL(`api/v1/ws/games/${gameId}`, API_BASE_URL);
      url.searchParams.set('token', encodeURIComponent(`${token}`));
      const socketUrl = resolveWebSocketURL(url?.toString());

      const ws = new WebSocket(socketUrl);
      webSocketRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const dto = JSON.parse(event.data);
          setCurrentGameState(dto);
        } catch (err) {
          console.error(
            `[ERR]: Invalid message received from WebSocket: ${event.data}`,
            err
          );
        }
      };

      ws.onclose = () => {
        setConnected(false);
        // Reconecta automaticamente após 2 segundos se a partida ainda estiver ativa
        reconnectTimeout.current = setTimeout(() => {
          if (gameId) connect();
        }, 2000);
      };

      ws.onerror = (err) => {
        console.error('Erro no WebSocket:', err);
        ws.close();
      };
    }

    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      webSocketRef.current?.close();
    };
  }, [gameId, token, mounted]);

  useEffect(() => {
    setMounted(true);
  }, [mounted]);

  return {
    connected,
    gameState: currentGameState,
  };
}
