const { Pool } = require('pg');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

exports.connect = () => pool.connect();

exports.saveExchangeRates = async (data) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const query = `
      INSERT INTO exchange_rates (date, base_currency, target_currency, rate, target_currency_name)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (date, base_currency, target_currency)
      DO UPDATE SET rate = EXCLUDED.rate, target_currency_name = EXCLUDED.target_currency_name
    `;
    for (const record of data) {
      const { date, base_currency, target_currency, rate, target_currency_name } = record;
      await client.query(query, [date, base_currency, target_currency, rate, target_currency_name]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saving exchange rates:', error.message);
    throw error;
  } finally {
    client.release();
  }
};
