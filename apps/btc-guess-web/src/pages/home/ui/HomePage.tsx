import { useEffect } from "react";
import { Bitcoin, Trophy, Loader2 } from "lucide-react";
import { BtcPriceCard } from "@/features/btc-price";
import { GuessGameCard } from "@/features/guess-game";
import { GuessHistoryList, useGuessHistory } from "@/features/guess-history";
import { usePlayerId, usePlayerScore } from "@/features/player";

export function HomePage() {
  const {
    playerId,
    error: playerError,
    loading: playerLoading,
  } = usePlayerId();
  const { guesses, isLoading: guessesLoading } = useGuessHistory(
    playerId ?? null,
  );
  const {
    score,
    loading: scoreLoading,
    refetch: refetchScore,
  } = usePlayerScore(playerId);

  useEffect(() => {
    const handleGuessResolved = () => refetchScore();
    window.addEventListener("guessResolved", handleGuessResolved);
    return () =>
      window.removeEventListener("guessResolved", handleGuessResolved);
  }, [refetchScore]);

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-muted/40 to-background">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bitcoin className="size-5" aria-hidden />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
              BTC Guess Game
            </h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Will Bitcoin be higher or lower in 60 seconds?
            </p>
          </div>

          {playerId && (
            <div className="flex shrink-0 items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2 shadow-sm">
              <Trophy className="size-4 text-amber-500" aria-hidden />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] text-muted-foreground">Score</span>
                <span className="font-mono text-sm font-bold tabular-nums text-foreground">
                  {scoreLoading ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    score
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <main className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6">
        {playerError && (
          <div
            className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {playerError}
          </div>
        )}

        {playerLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2
              className="size-10 animate-spin text-primary"
              aria-hidden
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-6 lg:flex-row h-full">
            {/* Left column: price + game */}
            <section className="flex w-full flex-col gap-4 lg:w-[380px] lg:shrink-0">
              {/**Dont' modify the BtcPriceCard component */}
              <BtcPriceCard refreshIntervalMs={0} />
              {playerId && <GuessGameCard playerId={playerId} />}
            </section>

            {/* Right column: history — full height with scroll */}
            {playerId && (
              <section className="flex h-full flex-1 flex-col">
                <GuessHistoryList
                  guesses={guesses}
                  isLoading={guessesLoading}
                />
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
