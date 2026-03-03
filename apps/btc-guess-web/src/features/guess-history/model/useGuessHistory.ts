import { useEffect } from "react";
import { useGuessStore } from "./guessStore";

export function useGuessHistory(playerId: string | null) {
  const { guesses, isLoading, fetchGuesses } = useGuessStore();

  useEffect(() => {
    if (!playerId) return;

    // Fetch guesses on mount
    fetchGuesses(playerId);
  }, [playerId, fetchGuesses]);

  return { guesses, isLoading };
}
