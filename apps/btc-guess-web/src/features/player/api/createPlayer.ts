import { post } from "@/shared/api/client";

export interface CreatePlayerResponse {
  playerId: string;
  score: number;
  currentGuess: unknown;
}

/**
 * Create or get existing player. Call with credentials: 'include' for cookie.
 */
export async function createPlayer(): Promise<CreatePlayerResponse> {
  return post<CreatePlayerResponse>("/player", {});
}
