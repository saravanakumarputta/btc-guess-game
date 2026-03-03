import "./App.css";
import { BtcPriceCard } from "@/features/btc-price";
import { GuessGameCard } from "@/features/guess-game";
import { GuessHistoryList, useGuessHistory } from "@/features/guess-history";
import { usePlayerId } from "@/features/player/model/usePlayerId";

function App() {
  const { playerId, error: playerError } = usePlayerId();
  const { guesses, loading, error: historyError, refetch } = useGuessHistory(
    playerId ?? null
  );

  return (
    <main className="flex min-h-screen flex-col gap-6 p-6">
      <BtcPriceCard />
      {playerError && (
        <p className="text-destructive text-sm" role="alert">
          {playerError}
        </p>
      )}
      {playerId && (
        <>
          <GuessGameCard
            playerId={playerId}
            onCountdownComplete={refetch}
          />
          <GuessHistoryList
            guesses={guesses}
            loading={loading}
            error={historyError}
          />
        </>
      )}
    </main>
  );
}

export default App;
