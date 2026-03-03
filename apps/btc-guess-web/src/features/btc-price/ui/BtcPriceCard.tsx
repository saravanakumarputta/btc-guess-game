import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBtcPrice } from "../model/useBtcPrice";

export interface BtcPriceCardProps {
  /** Auto-refresh interval in ms; set to 0 to disable. Default 10000. */
  refreshIntervalMs?: number;
}

export function BtcPriceCard({
  refreshIntervalMs = 10_000,
}: BtcPriceCardProps) {
  const { price, loading, error } = useBtcPrice(refreshIntervalMs);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">Bitcoin Price</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-muted-foreground text-sm">Loading…</p>}
        {error && (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && price != null && (
          <p className="text-2xl font-semibold tabular-nums">
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
