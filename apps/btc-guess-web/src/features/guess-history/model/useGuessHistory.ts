import { useState, useEffect, useCallback } from "react";
import { getGuesses } from "../api/getGuesses";
import type { GuessRecord } from "./types";

export function useGuessHistory(
  playerId: string | null,
  refetchIntervalMs = 15_000
) {
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuesses = useCallback(async () => {
    if (!playerId) {
      setGuesses([]);
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const list = await getGuesses(playerId);
      setGuesses(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load guesses");
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    setLoading(true);
    fetchGuesses();
    if (playerId && refetchIntervalMs > 0) {
      const id = setInterval(fetchGuesses, refetchIntervalMs);
      return () => clearInterval(id);
    }
  }, [playerId, fetchGuesses, refetchIntervalMs]);

  return { guesses, loading, error, refetch: fetchGuesses };
}
