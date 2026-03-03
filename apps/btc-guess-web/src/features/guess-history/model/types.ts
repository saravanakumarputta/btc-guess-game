export interface GuessRecord {
  playerId: string;
  timestamp: number;
  guessId: string;
  direction: "up" | "down";
  entryPrice: number;
  exitPrice?: number;
  result?: boolean | "correct" | "incorrect";
  resolvedAt?: number;
  status?: "in_progress" | "completed";
}
