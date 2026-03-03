export type GuessDirection = "up" | "down";

export interface SubmitGuessResponse {
  playerId: string;
  guessId: string;
  direction: GuessDirection;
  entryPrice: number;
  timestamp: number;
}

export const GUESS_COUNTDOWN_MS = 60_000;
