import { useState, useEffect, useCallback } from "react";
import { getBtcPrice } from "../api/getBtcPrice";

export function useBtcPrice(refreshIntervalMs = 10_000) {
  const [price, setPrice] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = useCallback(async () => {
    try {
      setError(null);
      const value = await getBtcPrice();
      setPrice(value);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load price");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrice();
    if (refreshIntervalMs > 0) {
      const id = setInterval(fetchPrice, refreshIntervalMs);
      return () => clearInterval(id);
    }
  }, [fetchPrice, refreshIntervalMs]);

  return { price, loading, error, refetch: fetchPrice };
}
