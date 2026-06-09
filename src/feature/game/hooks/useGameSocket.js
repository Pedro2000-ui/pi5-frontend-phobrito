import { API_BASE_URL } from '@core/constants';
import { resolveWebSocketURL } from '@core/helpers';
import { useEffect, useRef, useState } from 'react';

export function useGameSocket(gameId, token, enabled = true) {
  const [connected, setConnected] = useState(false);
  const [currentGameState, setCurrentGameState] = useState(null);
  const [mounted, setMounted] = useState(false);

  const reconnectTimeout = useRef(null);
  const webSocketRef = useRef(null);
  const enabledRef = useRef(enabled);

  // Mantém o ref sempre atualizado com o valor mais recente de enabled
  useEffect(() => {
    enabledRef.current = enabled;

    // Se ficou disabled enquanto havia conexão aberta, fecha imediatamente
    if (!enabled) {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      webSocketRef.current?.close();
    }
  }, [enabled]);

  useEffect(() => {
    if (!gameId || !token || !mounted || !enabled) return;

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
        // Só reconecta se ainda estiver habilitado — lê o ref para pegar o valor atual
        reconnectTimeout.current = setTimeout(() => {
          if (gameId && enabledRef.current) connect();
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
  }, [gameId, token, mounted, enabled]);

  useEffect(() => {
    setMounted(true);
  }, [mounted]);

  return {
    connected,
    gameState: currentGameState,
  };
}