import { get } from "@/shared/api/client";

export async function getBtcPrice(): Promise<Record<string, number>> {
  return get<Record<string, number>>("/btc-price");
}
