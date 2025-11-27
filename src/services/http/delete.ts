import { DeleteError, type DeleteErrorInstance } from '@/errors';

export async function del<TResponse>(
  url: string,
  options?: RequestInit
): Promise<TResponse | DeleteErrorInstance> {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      return new DeleteError(
        `Error Fetching (DELETE): ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const json: TResponse = await response.json();
      return json;
    }

    return {} as TResponse;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new DeleteError(message);
  }
}
