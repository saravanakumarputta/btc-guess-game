import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { submitGuess } from "../api/submitGuess";
import { GUESS_COUNTDOWN_MS, type GuessDirection } from "../model/types";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface GuessGameCardProps {
  playerId: string;
  /** Called when the 60s countdown finishes (so the parent can refetch guess history). */
  onCountdownComplete?: () => void;
}

type Status = "idle" | "counting";

export function GuessGameCard({
  playerId,
  onCountdownComplete,
}: GuessGameCardProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [direction, setDirection] = useState<GuessDirection | null>(null);
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);

  useEffect(() => {
    if (status !== "counting" || submittedAt == null) return;
    const tick = () => {
      const elapsed = Date.now() - submittedAt;
      const left = Math.max(0, GUESS_COUNTDOWN_MS - elapsed);
      setTimeLeftMs(left);
      if (left <= 0) {
        setStatus("idle");
        setDirection(null);
        setSubmittedAt(null);
        onCountdownComplete?.();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [status, submittedAt, onCountdownComplete]);

  const handleGuess = async (dir: GuessDirection) => {
    setError(null);
    try {
      const res = await submitGuess(playerId, dir);
      setDirection(dir);
      setSubmittedAt(res.timestamp);
      setStatus("counting");
      setTimeLeftMs(GUESS_COUNTDOWN_MS);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit guess");
    }
  };

  const timeLeftSeconds = Math.ceil(timeLeftMs / 1000);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">Guess the price</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {error && (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        )}

        {status === "idle" && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => handleGuess("up")}
              disabled={!playerId}
            >
              <ChevronUp className="size-5" />
              Up
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => handleGuess("down")}
              disabled={!playerId}
            >
              <ChevronDown className="size-5" />
              Down
            </Button>
          </div>
        )}

        {status === "counting" && (
          <div className="flex flex-col items-center gap-2 py-2">
            <p className="text-muted-foreground text-sm">
              You guessed{" "}
              <strong className="text-foreground">{direction}</strong>
            </p>
            <p className="text-3xl font-mono font-semibold tabular-nums">
              {timeLeftSeconds}s
            </p>
            <p className="text-muted-foreground text-xs">
              Result in {timeLeftSeconds} seconds…
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
