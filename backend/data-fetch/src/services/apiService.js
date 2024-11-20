const axios = require('axios');

const BASE_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1';

// Fetch all available currencies
exports.getAllCurrencies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/currencies.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
};

// Fetch exchange rates for HUF
exports.getHufExchangeRates = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/currencies/huf.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching HUF exchange rates:', error);
    throw error;
  }
};
