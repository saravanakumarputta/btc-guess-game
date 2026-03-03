import { post } from "@/shared/api/client";
import type { GuessDirection } from "../model/types";
import type { SubmitGuessResponse } from "../model/types";

export async function submitGuess(
  playerId: string,
  direction: GuessDirection
): Promise<SubmitGuessResponse> {
  return post<SubmitGuessResponse>("/guess", { playerId, direction });
}
