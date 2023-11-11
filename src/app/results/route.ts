import { fetchCurrencyData, fetchExchangeRate } from "@/utils/rapidApi";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetCurrency = searchParams.get("currency") || "CZK";
    const currencies = await fetchCurrencyData();

    if (currencies.length === 0) {
      throw new Error("No currencies available.");
    }

    let results = await Promise.all(
      currencies.map(async (currency: string) => {
        const rate = await fetchExchangeRate(currency, targetCurrency);
        return rate !== null ? { currency, rate } : null;
      })
    );

    results = results
      .filter((item) => item !== null)
      .sort((a, b) => b.rate - a.rate);

    const formattedResults = results.map(
      (item, index) =>
        `${index + 1}. 1 ${item.currency} -> ${item.rate.toFixed(
          2
        )} ${targetCurrency}`
    );

    return Response.json(formattedResults);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
