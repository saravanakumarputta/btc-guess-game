export type GuessDirection = "up" | "down";

export interface GuessRecord {
  playerId: string;
  timestamp: number;
  guessId: string;
  direction: GuessDirection;
  entryPrice: number;
  exitPrice?: number;
  result?: boolean;
  resolvedAt?: number;
  status?: "in_progress" | "completed";
}

export interface PlayerData {
  playerId: string;
  score: number;
  createdAt?: number;
  currentGuess?: {
    guessId: string;
    direction: GuessDirection;
    entryPrice: number;
    timestamp: number;
  };
  lastGuess?: {
    guessId: string;
    direction: GuessDirection;
    entryPrice: number;
    exitPrice: number;
    result: boolean;
    resolvedAt: number;
  };
}

export interface SubmitGuessResponse {
  playerId: string;
  guessId: string;
  direction: GuessDirection;
  entryPrice: number;
  timestamp: number;
}
