import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGuessGame } from "../model/useGuessGame";
import { ChevronUp, ChevronDown, Timer, Loader2 } from "lucide-react";

export interface GuessGameCardProps {
  playerId: string;
}

export function GuessGameCard({ playerId }: GuessGameCardProps) {
  const {
    status,
    direction,
    timeLeftSeconds,
    countdownProgress,
    error,
    handleGuess,
  } = useGuessGame(playerId);

  return (
    <Card className="w-full overflow-hidden border-border/80 shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Place your guess
        </CardTitle>
        <p className="text-sm font-normal text-muted-foreground">
          Will BTC be higher or lower in 60 seconds?
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 pt-0">
        {error && (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        )}

        {status === "loading" || status === "submitting" ? (
          <div className="flex items-center justify-center py-12">
            <Loader2
              className="size-10 animate-spin text-primary"
              aria-hidden
            />
          </div>
        ) : status === "idle" ? (
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="default"
              size="lg"
              onClick={() => handleGuess("up")}
              disabled={!playerId}
            >
              <ChevronUp className="size-6" aria-hidden />
              Up
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={() => handleGuess("down")}
              disabled={!playerId}
            >
              <ChevronDown className="size-6" aria-hidden />
              Down
            </Button>
          </div>
        ) : null}

        {status === "counting" && (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border/80 bg-muted/30 py-6">
            <p className="text-sm text-muted-foreground">
              You guessed{" "}
              <span className="font-semibold capitalize text-foreground">
                {direction}
              </span>
            </p>
            <div className="relative flex items-center justify-center">
              <svg
                className="size-24 -rotate-90"
                viewBox="0 0 36 36"
                aria-hidden
              >
                <path
                  className="text-muted/30"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary transition-all duration-1000 ease-linear"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${countdownProgress * 100}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono text-2xl font-bold tabular-nums text-foreground">
                {timeLeftSeconds}
              </span>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Timer className="size-3.5" aria-hidden />
              Result in {timeLeftSeconds}s
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
