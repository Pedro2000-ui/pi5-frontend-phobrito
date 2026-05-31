import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Função para mergear classes CSS, utilizando clsx para lidar com diferentes
 * tipos de entrada.
 *
 * @param classes
 *     Array de classes para mergear, podendo ser uma string, array de strings
 *     ou objeto com chaves como classes e valores booleanos indicando se a
 *     classe deve ser incluída ou não
 * @returns
 */
export function cn(...classes) {
  return twMerge(clsx(classes));
}

/**
 * Função para resolver uma URL de WebSocket a partir de uma URL HTTP/HTTPS.
 *
 * @param url
 *     A URL de entrada, que pode ser uma URL HTTP/HTTPS ou já uma URL
 *     de WebSocket
 * @returns
 */
export function resolveWebSocketURL(url) {
  let _url = url.trim();

  if (_url.startsWith('ws://') || _url.startsWith('wss://')) {
    return _url;
  }

  return _url?.replace(/^http/, 'ws')?.replace(/^https/, 'wss');
}
