export interface GuessRecord {
  playerId: string;
  timestamp: number;
  guessId: string;
  direction: "up" | "down";
  entryPrice: number;
  exitPrice: number;
  result: "correct" | "incorrect";
  resolvedAt: number;
}
