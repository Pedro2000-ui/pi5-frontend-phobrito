import { API_BASE_URL } from '@core/constants';
import { resolve } from 'pathe';

/**
 * Função para recuperar o token de acesso armazenado no localStorage.
 *
 * @returns {string}
 */
export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

/**
 * Função para verificar se um token de acesso está presente no localStorage.
 *
 * @returns {boolean}
 */
export function hasAccessToken() {
  return !!getAccessToken();
}

/**
 * Função para armazenar o token de acesso no localStorage, permitindo que ele
 * seja recuperado posteriormente para autenticação em requisições à API.
 *
 * @param {string} token
 */
export function setAccessToken(token) {
  localStorage.setItem('accessToken', token);
}

/**
 * Função para realizar requisições à API, construindo a URL completa a partir
 * do caminho fornecido e do base URL definido. Permite enviar corpo de
 * requisição e parâmetros de consulta, além de configurar outros aspectos da
 * requisição através do objeto de opções.
 *
 * @param {string} path
 * @param {Omit<RequestInit, "body"> & {
 *   body?: Record<string, any>;
 *   query?: Record<string, any>;
 * }} options
 */
export async function apiClient(path, options = {}) {
  const { body, query = {}, headers = {}, ...rest } = options;
  const url = new URL(
    resolve('api/v1', path?.replace(/^\//, '')),
    API_BASE_URL
  );

  if (query && Object.keys(query).length > 0) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url?.toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(hasAccessToken()
        ? { Authorization: `Bearer ${getAccessToken()}` }
        : {}),
    },
    body:
      typeof body === 'object' && !(body instanceof FormData)
        ? JSON.stringify(body)
        : body || undefined,
    ...rest,
  });

  if (!response?.ok) {
    throw new Error(`HTTP error! status: ${response.status}`, {
      cause: await response?.json(),
    });
  }

  return await response.json();
}
