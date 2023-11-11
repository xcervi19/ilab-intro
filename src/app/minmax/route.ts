import { fetchCurrencyData, fetchExchangeRate } from "@/utils/rapidApi";

async function findMinMaxRate() {
  const currencies = await fetchCurrencyData();
  let rates = [];

  for (let currency of currencies) {
    const rate = await fetchExchangeRate(currency, 'CZK');
    rates.push({ currency, exchangeRate: rate });
  }
  console.log(rates)
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
  const result = await findMinMaxRate();
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
}

