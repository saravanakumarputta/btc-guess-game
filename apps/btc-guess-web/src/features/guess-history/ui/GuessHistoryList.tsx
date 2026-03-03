import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GuessRecord } from "../model/types";
import { ChevronUp, ChevronDown, History, Loader2 } from "lucide-react";

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
  return new Date(ms).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

/** API can return result as boolean or legacy "correct" | "incorrect" */
function isCorrect(result: boolean | string | undefined): boolean {
  if (result === true || result === "correct") return true;
  return false;
}

export function GuessHistoryList({
  guesses,
  loading,
  error,
}: GuessHistoryListProps) {
  return (
    <Card className="w-full overflow-hidden border-border/80 shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <History className="size-5 text-muted-foreground" aria-hidden />
          Guess history
        </CardTitle>
        <p className="text-sm font-normal text-muted-foreground">
          Your recent guesses and results
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {error && (
          <div
            className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        )}
        {loading && guesses.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="size-8 animate-spin" aria-hidden />
            <span className="text-sm">Loading history…</span>
          </div>
        )}
        {!loading && guesses.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 py-12 text-center">
            <History className="mx-auto size-10 text-muted-foreground/50" aria-hidden />
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              No guesses yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Place a guess above to see it here
            </p>
          </div>
        )}
        {guesses.length > 0 && (
          <ul className="flex flex-col gap-2" role="list">
            {guesses.map((g) => {
              const completed =
                g.status === "completed" ||
                g.result !== undefined ||
                (g.resolvedAt != null && g.exitPrice != null);
              const correct = isCorrect(g.result);
              return (
                <li
                  key={g.guessId}
                  className="flex flex-col gap-2 rounded-lg border border-border/80 bg-card px-4 py-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {g.direction === "up" ? (
                        <ChevronUp className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
                      ) : (
                        <ChevronDown className="size-4 text-red-600 dark:text-red-400" aria-hidden />
                      )}
                      <span className="text-sm font-medium capitalize text-foreground">
                        {g.direction}
                      </span>
                      {completed ? (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            correct
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                              : "bg-red-500/15 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {correct ? "Correct" : "Incorrect"}
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                          Pending
                        </span>
                      )}
                    </div>
                    {g.resolvedAt ? (
                      <time
                        className="text-xs text-muted-foreground"
                        dateTime={new Date(g.resolvedAt).toISOString()}
                      >
                        {formatTime(g.resolvedAt)}
                      </time>
                    ) : null}
                  </div>
                  <div className="flex items-baseline gap-1.5 font-mono text-sm tabular-nums">
                    <span className="text-muted-foreground">
                      ${g.entryPrice != null ? formatPrice(g.entryPrice) : "—"}
                    </span>
                    {completed && g.exitPrice != null ? (
                      <>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium text-foreground">
                          ${formatPrice(g.exitPrice)}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">→ …</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
