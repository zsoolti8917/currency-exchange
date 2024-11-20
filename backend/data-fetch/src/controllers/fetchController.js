const apiService = require('../services/apiService');
const db = require('../database/db');

exports.fetchAndSaveExchangeRates = async (req, res) => {
  try {
    // Fetch available currencies
    const currencies = await apiService.getAllCurrencies();

    // Fetch HUF exchange rates
    const hufData = await apiService.getHufExchangeRates();
    const { date, huf: exchangeRates } = hufData;

    // Transform data into database-compatible format
    const transformedData = Object.keys(exchangeRates).map(targetCurrency => ({
      date,
      base_currency: 'HUF',
      target_currency: targetCurrency,
      rate: exchangeRates[targetCurrency],
      target_currency_name: currencies[targetCurrency] || 'Unknown' // Get full name if available
    }));

    // Save data to the database
    await db.saveExchangeRates(transformedData);

    res.status(200).send({ message: 'Exchange rates fetched and saved successfully' });
  } catch (error) {
    console.error('Error fetching and saving exchange rates:', error);
    res.status(500).send({ error: 'Failed to fetch and save exchange rates' });
  }
};
