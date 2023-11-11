import { fetchExchangeRate } from "@/utils/rapidApi";

interface ConvertionRequest {
  from: {
    currency: string;
    quantity: number;
  };
  to: string;
}

export async function POST(request: Request) {
  const requestBody = await request.json();

  const conversionResults = await Promise.all(
    requestBody.map(async (conversion: ConvertionRequest) => {
      const fromCurrency = conversion.from.currency;
      const quantity = conversion.from.quantity;
      const toCurrency = conversion.to;

      const rate = await fetchExchangeRate(fromCurrency, toCurrency);
      const convertedAmount = rate * quantity;

      if (rate === null) {
        return `Service unavailable for converting ${fromCurrency} to ${toCurrency}`;
      }

      return `${quantity} ${fromCurrency} -> ${toCurrency} ${convertedAmount.toFixed(
        2
      )}`;
    })
  );

  return Response.json(conversionResults);
}
