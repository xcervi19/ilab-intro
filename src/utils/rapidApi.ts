import axios, { AxiosRequestConfig } from 'axios';

const options: AxiosRequestConfig = {
  method: 'GET',
  url: 'https://currency-exchange.p.rapidapi.com/listquotes',
  headers: {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
  }
};

export async function fetchCurrencyData() {
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

export async function fetchExchangeRate(fromCurrency: string, toCurrency: string = 'CZK') {
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