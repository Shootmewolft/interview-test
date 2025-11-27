import { PostError, type PostErrorInstance } from '@/errors';

export async function post<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  options?: RequestInit
): Promise<TResponse | PostErrorInstance> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(body ? body : {}),
      ...options,
    });

    if (!response.ok) {
      return new PostError(
        `Error Fetching (POST): ${response.status} ${response.statusText}`
      );
    }

    const json: TResponse = await response.json();
    return json;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new PostError(message);
  }
}
