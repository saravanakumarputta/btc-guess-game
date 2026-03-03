import { fetchBTCPrice } from "../utils/btcPrice";
import { ok, serverError } from "../utils/response";

export const handler = async () => {
  try {
    const btcPrice = await fetchBTCPrice();
    return ok(btcPrice);
  } catch (error) {
    return serverError("Failed to fetch BTC price");
  }
};
