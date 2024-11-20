const express = require('express');
const bodyParser = require('body-parser');
const fetchRoutes = require('./routes/fetchRoutes');
const db = require('./database/db');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});


const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/fetch', fetchRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).send({ status: 'Data Fetch Service is running' });
});

// Database Connection Check
db.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Database connection failed:', err));

module.exports = app;
