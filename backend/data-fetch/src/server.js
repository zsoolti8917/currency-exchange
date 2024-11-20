const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Data Fetch Service running on port ${PORT}`);
});
