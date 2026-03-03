import "./App.css";
import { BtcPriceCard } from "@/features/btc-price";
import { GuessGameCard } from "@/features/guess-game";
import { GuessHistoryList, useGuessHistory } from "@/features/guess-history";
import { usePlayerId } from "@/features/player/model/usePlayerId";
import { Bitcoin } from "lucide-react";

function App() {
  const { playerId, error: playerError } = usePlayerId();
  const { guesses, loading, error: historyError, refetch } = useGuessHistory(
    playerId ?? null
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background">
      <header className="border-b border-border/80 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bitcoin className="size-6" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              BTC Price Guessing Game
            </h1>
            <p className="text-sm text-muted-foreground">
              Guess if Bitcoin price goes up or down in 60 seconds
            </p>
          </div>
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

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <section className="flex flex-col gap-6">
            <BtcPriceCard />
            {playerId && (
              <GuessGameCard
                playerId={playerId}
                onCountdownComplete={refetch}
              />
            )}
          </section>

          {playerId && (
            <section className="lg:sticky lg:top-6">
              <GuessHistoryList
                guesses={guesses}
                loading={loading}
                error={historyError}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
