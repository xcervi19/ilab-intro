import { fetchCurrencyData, fetchExchangeRate } from "@/utils/rapidApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetCurrency = searchParams.get("currency") || "CZK";
  const currencies = await fetchCurrencyData();

  let results = await Promise.all(
    currencies.map(async (currency: string) => {
      const rate = await fetchExchangeRate(currency, targetCurrency);
      return { currency, rate };
    })
  );

  results = results.sort((a, b) => b.rate - a.rate);

  const resultsString = results.map((item, index) =>
    `${index + 1}. 1 ${item.currency} -> ${item.rate.toFixed(2)} ${targetCurrency}`
  ).join(",\n");

  const finalString = resultsString.replace(/,([^,]*)$/, '$1');

  const headers = new Headers();
  headers.set('Content-Type', 'text/plain');
  headers.set('Content-Disposition', 'attachment; filename="exchange-rates.txt"');

  return new Response(finalString, { headers });
}
