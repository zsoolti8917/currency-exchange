const cron = require('node-cron');
const fetchController = require('../controllers/fetchController');

// Schedule task to fetch and save exchange rates daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Starting daily fetch of HUF exchange rates...');
  try {
    await fetchController.fetchAndSaveExchangeRates();
    console.log('Daily fetch completed successfully.');
  } catch (error) {
    console.error('Error during daily fetch:', error);
  }
});
