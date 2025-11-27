import { PutError, type PutErrorInstance } from "@/errors";

export async function put<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  options?: RequestInit,
): Promise<TResponse | PutErrorInstance> {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body ? body : {}),
      ...options,
    });

    if (!response.ok) {
      return new PutError(
        `Error Fetching (PUT): ${response.status} ${response.statusText}`,
      );
    }

    const json: TResponse = await response.json();
    return json;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new PutError(message);
  }
}
