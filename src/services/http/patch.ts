import { PatchError, type PatchErrorInstance } from '@/errors';

export async function patch<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  options?: RequestInit
): Promise<TResponse | PatchErrorInstance> {
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(body ? body : {}),
      ...options,
    });

    if (!response.ok) {
      return new PatchError(
        `Error Fetching (PATCH): ${response.status} ${response.statusText}`
      );
    }

    const json: TResponse = await response.json();
    return json;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new PatchError(message);
  }
}
