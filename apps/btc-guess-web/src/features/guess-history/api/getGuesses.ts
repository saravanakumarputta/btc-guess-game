import { get } from "@/shared/api/client";
import type { GuessRecord } from "../model/types";

export async function getGuesses(playerId: string): Promise<GuessRecord[]> {
  return get<GuessRecord[]>(`/player/${playerId}/guesses`);
}
