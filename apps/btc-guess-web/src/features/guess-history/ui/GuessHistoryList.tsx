import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GuessRecord } from "../model/types";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface GuessHistoryListProps {
  guesses: GuessRecord[];
  loading: boolean;
  error: string | null;
}

function formatPrice(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatTime(ms: number) {
  return new Date(ms).toLocaleString();
}

export function GuessHistoryList({
  guesses,
  loading,
  error,
}: GuessHistoryListProps) {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-lg">Your guesses</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="text-destructive text-sm mb-3" role="alert">
            {error}
          </p>
        )}
        {loading && guesses.length === 0 && (
          <p className="text-muted-foreground text-sm">Loading…</p>
        )}
        {!loading && guesses.length === 0 && (
          <p className="text-muted-foreground text-sm">No guesses yet.</p>
        )}
        {guesses.length > 0 && (
          <ul className="flex flex-col gap-2" role="list">
            {guesses.map((g) => (
              <li
                key={g.guessId}
                className="flex flex-col gap-1 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-2">
                  {g.direction === "up" ? (
                    <ChevronUp className="size-4 text-primary" />
                  ) : (
                    <ChevronDown className="size-4 text-primary" />
                  )}
                  <span className="font-medium capitalize">{g.direction}</span>
                  <span
                    className={
                      g.result
                        ? "text-green-600 dark:text-green-400 font-medium"
                        : "text-destructive font-medium"
                    }
                  >
                    {g.result ? "Correct" : "Incorrect"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="tabular-nums">
                    ${g.entryPrice ? formatPrice(g.entryPrice) : "--"} → $
                    {g.exitPrice ? formatPrice(g.exitPrice) : "--"}
                  </span>
                  {g.resolvedAt ? (
                    <time
                      className="text-xs"
                      dateTime={new Date(g.resolvedAt).toISOString()}
                    >
                      {formatTime(g.resolvedAt)}
                    </time>
                  ) : (
                    "--"
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
