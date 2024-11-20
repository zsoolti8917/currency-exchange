const express = require('express');
const fetchController = require('../controllers/fetchController');

const router = express.Router();

// Manual trigger to fetch and save exchange rates
router.post('/start', fetchController.fetchAndSaveExchangeRates);

module.exports = router;
