import { apiClient } from '@core/helpers/fetch';

export function getMe() {
  return apiClient('/players/me', {
    method: 'GET',
  });
}

export function listPlayers() {
  return apiClient('/players', {
    method: 'GET',
  });
}

export function registerPlayer(dto) {
  return apiClient('/players', {
    method: 'POST',
    body: dto,
  });
}

export function updatePlayerMoveEndpoint(playerId, dto) {
  return apiClient(`/players/${playerId}`, {
    method: 'PUT',
    body: dto,
  });
}

export function listGames(dto) {
  return apiClient('/games', {
    method: 'GET',
    query: dto,
  });
}

export function getGame(gameId) {
  return apiClient(`/games/${gameId}`, {
    method: 'GET',
  });
}

export function createGame(dto) {
  return apiClient('/games', {
    method: 'POST',
    body: dto,
  });
}

export function startGame(gameId, dto) {
  return apiClient(`/games/${gameId}/start`, {
    method: 'POST',
    body: dto,
  });
}

export function joinGame(gameId, dto) {
  return apiClient(`/games/${gameId}/join`, {
    method: 'POST',
    body: dto,
  });
}

export function registerSpectator(gameId, dto) {
  return apiClient(`/games/${gameId}/spectators`, {
    method: 'POST',
    body: dto,
  });
}

export function getApiMockState() {
  return apiClient('/games/mock-state', {
    method: 'POST',
  });
}

export function sendApiMockAction(dto) {
  return apiClient('/games/mock-state', {
    method: 'POST',
    body: dto,
  });
}
