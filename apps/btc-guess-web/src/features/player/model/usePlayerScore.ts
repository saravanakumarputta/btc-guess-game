import { useState, useEffect, useCallback } from "react";
import { getPlayer, type PlayerData } from "../api/getPlayer";

export function usePlayerScore(
  playerId: string | null,
  initialPlayerData?: PlayerData | null,
  refetchTrigger?: any,
) {
  const [score, setScore] = useState<number>(
    () => initialPlayerData?.score ?? 0,
  );
  const [loading, setLoading] = useState(true);

  const fetchScore = useCallback(async () => {
    if (!playerId) {
      setLoading(false);
      return;
    }

    try {
      const player: PlayerData = await getPlayer(playerId);
      setScore(player.score);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch player score:", err);
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    // If initialPlayerData parameter was explicitly provided (even if null)
    if (initialPlayerData !== undefined) {
      setScore(initialPlayerData?.score ?? 0);
      setLoading(false);
      return;
    }

    // If playerId doesn't exist yet, don't fetch
    if (!playerId) {
      setLoading(false);
      return;
    }

    // Only fetch if initialPlayerData was not passed at all (undefined check above failed)
    // This is a fallback for anonymous users or old localStorage sessions
    fetchScore();
  }, [fetchScore, initialPlayerData, refetchTrigger, playerId]);

  return { score, loading, refetch: fetchScore };
}
