import { config } from "../config";

/**
 * Generic GET request to the API. Handles base URL, JSON, and error parsing.
 */
export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${config.apiBaseUrl}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const text = await res.text();
    let message: string;
    try {
      const json = JSON.parse(text) as { message?: string };
      message = json.message ?? text;
    } catch {
      message = text || res.statusText;
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}
