import axios from "axios";

const API_KEY = "ct9sq51r01quh43oro60ct9sq51r01quh43oro6g";
const BASE_URL = "https://finnhub.io/api/v1";

export const fetchStockData = async (symbol) => {
  try {
    const response = await axios.get(`${BASE_URL}/quote`, {
      params: {
        symbol,
        token: API_KEY,
      },
    });

    console.log(`Data for ${symbol}:`, response.data);

    return {
      Symbol: symbol,
      CurrentPrice: response.data.c,
      High: response.data.h,
      Low: response.data.l,
      Open: response.data.o,
      PreviousClose: response.data.pc,
    };
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error.message);
    return null;
  }
};

export const fetchCompanyNews = async (symbol) => {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7); // News from the last 7 days
    const formattedFromDate = fromDate.toISOString().split("T")[0]; // YYYY-MM-DD format
    const formattedToDate = new Date().toISOString().split("T")[0];
  
    try {
      const response = await axios.get(`${BASE_URL}/company-news`, {
        params: {
          symbol,
          from: formattedFromDate,
          to: formattedToDate,
          token: API_KEY,
        },
      });
  
      console.log("News Data Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching news for ${symbol}:`, error.message);
      return [];
    }
  };
