import { useState, useEffect } from "react";
import { createPlayer } from "../api/createPlayer";

const PLAYER_ID_KEY = "btc-guess-playerId";

export function usePlayerId() {
  const [playerId, setPlayerId] = useState<string | null>(() =>
    localStorage.getItem(PLAYER_ID_KEY),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(
    () => !localStorage.getItem(PLAYER_ID_KEY),
  );

  useEffect(() => {
    // If we already have a playerId from localStorage, skip API call
    if (playerId) {
      return;
    }

    let cancelled = false;

    // No stored playerId, create a new player
    createPlayer()
      .then((res) => {
        if (!cancelled) {
          setPlayerId(res.playerId);
          // Store in localStorage for persistence
          localStorage.setItem(PLAYER_ID_KEY, res.playerId);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load player");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [playerId]);

  return { playerId, error, loading };
}

/**
 * Get the current playerId from localStorage (synchronous).
 * Returns null if not found.
 */
export function getStoredPlayerId(): string | null {
  return localStorage.getItem(PLAYER_ID_KEY);
}

/**
 * Clear the stored playerId (for logout/reset).
 */
export function clearStoredPlayerId(): void {
  localStorage.removeItem(PLAYER_ID_KEY);
}
