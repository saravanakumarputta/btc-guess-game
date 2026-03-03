import { useState, useEffect, useCallback } from "react";
import { submitGuess } from "../api/submitGuess";
import { getPlayer, type PlayerData } from "@/features/player";
import { GUESS_COUNTDOWN_MS, type GuessDirection } from "./types";
import { useGuessStore } from "@/features/guess-history";

export type GuessStatus = "idle" | "counting" | "loading" | "submitting";

export function useGuessGame(playerId: string) {
  const { addGuess, startPolling } = useGuessStore();
  const [status, setStatus] = useState<GuessStatus>("loading");
  const [direction, setDirection] = useState<GuessDirection | null>(null);
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!playerId) return;

    let cancelled = false;

    getPlayer(playerId)
      .then((player: PlayerData) => {
        if (cancelled) return;

        if (player.currentGuess) {
          const { timestamp, direction: dir } = player.currentGuess;
          const elapsed = Date.now() - timestamp;
          const remaining = GUESS_COUNTDOWN_MS - elapsed;

          if (remaining > 0) {
            setDirection(dir);
            setSubmittedAt(timestamp);
            setTimeLeftMs(remaining);
            setStatus("counting");
          } else {
            setStatus("idle");
          }
        } else {
          setStatus("idle");
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          console.error("Failed to load player:", err);
          setStatus("idle");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [playerId]);

  // Countdown timer
  useEffect(() => {
    if (status !== "counting" || submittedAt == null) return;

    const tick = () => {
      const elapsed = Date.now() - submittedAt;
      const left = Math.max(0, GUESS_COUNTDOWN_MS - elapsed);
      setTimeLeftMs(left);

      if (left <= 0) {
        startPolling(playerId);
        setStatus("idle");
        setDirection(null);
        setSubmittedAt(null);
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [status, submittedAt, playerId, startPolling]);

  const handleGuess = useCallback(
    async (dir: GuessDirection) => {
      setError(null);
      setStatus("submitting");

      try {
        const res = await submitGuess(playerId, dir);

        addGuess({
          playerId: res.playerId,
          timestamp: res.timestamp,
          guessId: res.guessId,
          direction: res.direction,
          entryPrice: res.entryPrice,
          status: "in_progress",
        });

        setDirection(dir);
        setSubmittedAt(res.timestamp);
        setTimeLeftMs(GUESS_COUNTDOWN_MS);
        setStatus("counting");
      } catch (e) {
        setStatus("idle");
        setError(e instanceof Error ? e.message : "Failed to submit guess");
      }
    },
    [playerId, addGuess],
  );

  const timeLeftSeconds = Math.ceil(timeLeftMs / 1000);
  const countdownProgress = 1 - timeLeftMs / GUESS_COUNTDOWN_MS;

  return {
    status,
    direction,
    timeLeftSeconds,
    countdownProgress,
    error,
    handleGuess,
  };
}
