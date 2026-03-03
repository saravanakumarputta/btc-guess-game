import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBtcPrice } from "../model/useBtcPrice";
import { TrendingUp } from "lucide-react";

export interface BtcPriceCardProps {
  refreshIntervalMs?: number;
}

export function BtcPriceCard({
  refreshIntervalMs = 10_000,
}: BtcPriceCardProps) {
  const { price, loading, error } = useBtcPrice(refreshIntervalMs);

  return (
    <Card className="w-full overflow-hidden border-border/80 shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
          <TrendingUp className="size-4 text-primary" aria-hidden />
          Live price
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            <span className="text-sm">Updating…</span>
          </div>
        )}
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && price != null && (
          <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground sm:text-4xl">
            $
            {price.usd.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
