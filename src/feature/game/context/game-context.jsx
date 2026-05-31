import { setAccessToken } from '@core/helpers/fetch';
import { createContext, useContext, useEffect, useState } from 'react';

const context = createContext({});

function readStoredValue(key) {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
}

export const GameContextProvider = ({ children }) => {
  const [player, setPlayer] = useState(() => readStoredValue('player'));
  const [spectator, setSpectatorData] = useState(() =>
    readStoredValue('spectator')
  );

  function setSpectator(value) {
    setSpectatorData(() => {
      return Object.assign({}, spectator, {
        [value?.game_id]: value,
      });
    });
  }

  function logout() {
    setPlayer(null);
    setSpectator(null);
  }

  useEffect(() => {
    if (player) {
      localStorage.setItem('player', JSON.stringify(player));
      setAccessToken(player?.player_access_token);
    } else {
      localStorage.removeItem('player');
      setAccessToken(null);
    }
  }, [player]);

  useEffect(() => {
    if (spectator) {
      localStorage.setItem('spectator', JSON.stringify(spectator));
    } else {
      localStorage.removeItem('spectator');
    }
  }, [spectator]);

  return (
    <context.Provider
      value={{ player, setPlayer, spectator, setSpectator, logout }}
    >
      {children}
    </context.Provider>
  );
};

export function useGameContext() {
  try {
    return useContext(context);
  } catch (err) {
    throw new Error(
      'useGameContext deve ser usado dentro de um GameContextProvider'
    );
  }
}
