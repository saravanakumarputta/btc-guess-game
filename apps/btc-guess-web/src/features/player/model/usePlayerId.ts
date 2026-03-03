import { useState, useEffect } from "react";
import { createPlayer } from "../api/createPlayer";
import type { PlayerData } from "shared-types";

const PLAYER_ID_KEY = "btc-guess-playerId";

interface UsePlayerIdOptions {
  userId?: string;
}

export function usePlayerId(options?: UsePlayerIdOptions) {
  const { userId } = options || {};

  const [playerId, setPlayerId] = useState<string | null>(() => {
    return localStorage.getItem(PLAYER_ID_KEY);
  });
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // If userId is provided from auth, use it directly
    if (userId) {
      setLoading(true);

      // Create/get player with authenticated userId - returns full player data
      createPlayer(userId)
        .then((res) => {
          if (!cancelled) {
            setPlayerId(res.playerId);
            setPlayerData(res);
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
    }

    // If we already have a playerId from localStorage, skip API call
    if (playerId) {
      setLoading(false);
      return;
    }

    // No stored playerId, create a new anonymous player
    createPlayer()
      .then((res) => {
        if (!cancelled) {
          setPlayerId(res.playerId);
          setPlayerData(res);
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
  }, [playerId, userId]);

  return { playerId, playerData, error, loading };
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
