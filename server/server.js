const mongoose = require('mongoose');
const config = require('./config');

const app = require('./app');

mongoose
  .connect(config.db)
  .then(() => console.log('DB connection successful! 😎'))
  .catch(() => console.log('DB connection failed! 😭'));

const port = config.port;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
