import "./App.css";
import { useEffect } from "react";
import { BtcPriceCard } from "@/features/btc-price";
import { GuessGameCard } from "@/features/guess-game";
import { GuessHistoryList, useGuessHistory } from "@/features/guess-history";
import { usePlayerId, usePlayerScore } from "@/features/player";
import { Bitcoin, Trophy } from "lucide-react";

function App() {
  const {
    playerId,
    error: playerError,
    loading: playerLoading,
  } = usePlayerId();
  const { guesses, isLoading: guessesLoading } = useGuessHistory(
    playerId ?? null,
  );
  const { score, refetch: refetchScore } = usePlayerScore(playerId);

  // Refetch score when guess is resolved
  useEffect(() => {
    const handleGuessResolved = () => {
      refetchScore();
    };

    window.addEventListener("guessResolved", handleGuessResolved);
    return () =>
      window.removeEventListener("guessResolved", handleGuessResolved);
  }, [refetchScore]);

  return (
    <div className="min-h-screen bg-linear-to-b from-muted/40 to-background">
      <header className="border-b border-border/80 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bitcoin className="size-6" aria-hidden />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              BTC Price Guessing Game
            </h1>
            <p className="text-sm text-muted-foreground">
              Guess if Bitcoin price goes up or down in 60 seconds
            </p>
          </div>
          {playerId && (
            <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-card px-3 py-2">
              <Trophy className="size-5 text-amber-500" aria-hidden />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Score</span>
                <span className="font-mono text-lg font-bold tabular-nums text-foreground">
                  {score}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {playerError && (
          <div
            className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {playerError}
          </div>
        )}

        {playerLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {!playerLoading && (
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <section className="flex flex-col gap-6">
              {/**Dont' modufy the BtcPriceCard component */}
              <BtcPriceCard refreshIntervalMs={0} />
              {playerId && <GuessGameCard playerId={playerId} />}
            </section>

            {playerId && (
              <section className="lg:sticky lg:top-6">
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

export default App;
