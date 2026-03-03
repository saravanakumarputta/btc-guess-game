import { useState, useEffect } from "react";
import { createPlayer } from "../api/createPlayer";

export function usePlayerId() {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    createPlayer()
      .then((res) => {
        if (!cancelled) setPlayerId(res.playerId);
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load player");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { playerId, error };
}
