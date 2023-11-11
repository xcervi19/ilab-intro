import { fetchCurrencyData, fetchExchangeRate } from "@/utils/rapidApi";

async function findMinMaxRate() {
  const currencies = await fetchCurrencyData();
  if (currencies.length === 0) {
    throw new Error("No currencies available.");
  }

  let rates = [];

  for (let currency of currencies) {
    const rate = await fetchExchangeRate(currency, "CZK");
    if (rate !== null) {
      rates.push({ currency, exchangeRate: rate });
    }
  }
  if (rates.length === 0) {
    throw new Error("No exchange rates available.");
  }
  let minRate = rates[0];
  let maxRate = rates[0];

  for (let rate of rates) {
    if (rate.exchangeRate < minRate.exchangeRate) {
      minRate = rate;
    }
    if (rate.exchangeRate > maxRate.exchangeRate) {
      maxRate = rate;
    }
  }

  return { min: minRate, max: maxRate };
}

export async function GET(request: Request) {
  try {
    const result = await findMinMaxRate();
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
