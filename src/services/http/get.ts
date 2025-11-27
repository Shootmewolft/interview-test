import { GetError, type GetErrorInstance } from "@/errors";

export async function get<TResponse>(
  url: string,
  options?: RequestInit,
): Promise<TResponse | GetErrorInstance> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      return new GetError(
        `Error Fetching (GET): ${response.status} ${response.statusText}`,
      );
    }

    const json: TResponse = await response.json();
    return json;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new GetError(message);
  }
}
