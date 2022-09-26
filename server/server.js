const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');
dotenv.config({ path: './.env' });

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB connection successful! 😎'))
  .catch(() => console.log('DB connection failed! 😭'));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
