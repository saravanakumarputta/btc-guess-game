import { useState, useEffect, useCallback } from "react";
import { getPlayer, type PlayerData } from "../api/getPlayer";

export function usePlayerScore(playerId: string | null, refetchTrigger?: any) {
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchScore = useCallback(async () => {
    if (!playerId) {
      setScore(0);
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
    fetchScore();
  }, [fetchScore, refetchTrigger]);

  return { score, loading, refetch: fetchScore };
}
