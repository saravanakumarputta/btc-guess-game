export const fetchBTCPrice = async (): Promise<number> => {
  const apiKey = process.env.COINGECKO_API_KEY;

  if (!apiKey) {
    throw new Error("COINGECKO_API_KEY environment variable is not set");
  }

  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=bitcoin&x_cg_demo_api_key=${apiKey}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch BTC price: ${response.statusText}`);
  }

  const data = await response.json();
  return data.bitcoin.usd as number;
};
