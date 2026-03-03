import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GuessRecord } from "../model/types";
import { ChevronUp, ChevronDown, History, Loader2 } from "lucide-react";
import { formatPrice } from "@/shared/utils/fomatPrice";
import { formatTime } from "@/shared/utils/formatTime";

export interface GuessHistoryListProps {
  guesses: GuessRecord[];
  isLoading?: boolean;
}

function isCorrect(result: boolean | undefined): boolean {
  return result === true;
}

export function GuessHistoryList({
  guesses,
  isLoading,
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
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
          </div>
        )}
        {!isLoading && guesses.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 py-12 text-center">
            <History
              className="mx-auto size-10 text-muted-foreground/50"
              aria-hidden
            />
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              No guesses yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Place a guess above to see it here
            </p>
          </div>
        )}
        {!isLoading && guesses.length > 0 && (
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
                        <ChevronUp
                          className="size-4 text-emerald-600 dark:text-emerald-400"
                          aria-hidden
                        />
                      ) : (
                        <ChevronDown
                          className="size-4 text-red-600 dark:text-red-400"
                          aria-hidden
                        />
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
