
import axios, { AxiosRequestConfig } from 'axios';

const options: AxiosRequestConfig = {
  method: 'GET',
  url: 'https://currency-exchange.p.rapidapi.com/listquotes',
  headers: {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
  }
};

async function fetchCurrencyData() {
  try {
    const response = await axios.request(options);
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return []
  }
}

async function fetchExchangeRate(fromCurrency: string, toCurrency: string = 'CZK') {
  const optionsRate: AxiosRequestConfig = {
    method: 'GET',
    url: 'https://currency-exchange.p.rapidapi.com/exchange',
    params: {
      from: fromCurrency,
      to: toCurrency,
      q: '1.0'
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(optionsRate);
    return response.data;
  } catch (error) {
    // Error handling
  }
}

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

