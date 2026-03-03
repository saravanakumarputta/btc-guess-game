import { config } from "../config";

function handleError(res: Response, text: string): never {
  let message: string;
  try {
    const json = JSON.parse(text) as { message?: string };
    message = json.message ?? text;
  } catch {
    message = text || res.statusText;
  }
  throw new Error(message);
}

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
    handleError(res, text);
  }
  return res.json() as Promise<T>;
}

/**
 * Generic POST request to the API. Handles base URL, JSON body, and error parsing.
 */
export async function post<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${config.apiBaseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    handleError(res, text);
  }
  return res.json() as Promise<T>;
}
