const axios = require('axios');
const db = require('../database/db'); // Import database utility
const moment = require('moment'); // Install moment.js for date manipulation
const dotenv = require('dotenv');
const path = require('path');

// Resolve the absolute path to the .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);

const BASE_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api';

// Generate all dates for the previous month
const generateDatesForLastMonth = () => {
  const dates = [];
  const today = moment();
  const lastMonth = today.clone().subtract(1, 'month');

  const startDate = lastMonth.clone().startOf('month');
  const endDate = lastMonth.clone().endOf('month');

  let currentDate = startDate;
  while (currentDate.isSameOrBefore(endDate)) {
    dates.push(currentDate.format('YYYY-MM-DD'));
    currentDate.add(1, 'day');
  }
  return dates;
};

// Fetch exchange rates for a specific date
const fetchExchangeRatesForDate = async (date) => {
  try {
    const url = `${BASE_URL}@${date}/v1/currencies/huf.json`;
    console.log(`Fetching data for date: ${date}`);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ${date}:`, error.message);
    return null; // Skip if there's an error
  }
};

// Transform and save data to the database
const saveExchangeRatesToDb = async (data, date, currencies) => {
  if (!data || !data.huf) return;

  const transformedData = Object.keys(data.huf).map((targetCurrency) => ({
    date,
    base_currency: 'HUF',
    target_currency: targetCurrency,
    rate: data.huf[targetCurrency],
    target_currency_name: currencies[targetCurrency] || 'Unknown',
  }));

  try {
    await db.saveExchangeRates(transformedData);
    console.log(`Saved data for ${date} successfully.`);
  } catch (error) {
    console.error(`Error saving data for ${date}:`, error.message);
  }
};

// Main seeding function
const seedDataForLastMonth = async () => {
  try {
    // Fetch available currencies
    const currenciesResponse = await axios.get(`${BASE_URL}/v1/currencies.json`);
    const currencies = currenciesResponse.data;

    const dates = generateDatesForLastMonth();
    console.log(`Seeding data for ${dates.length} days...`);

    for (const date of dates) {
      const exchangeData = await fetchExchangeRatesForDate(date);
      await saveExchangeRatesToDb(exchangeData, date, currencies);
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error.message);
  }
};

// Execute the script
seedDataForLastMonth()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
