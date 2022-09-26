const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');
const authRouter = require('./routes/authRouter');

dotenv.config({ path: './.env' });
const app = express();

//MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

//ROUTES

app.get('/', (req, res) => {
  res.send('Welcome!');
});

app.use('/api/v1/auth', authRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorController);

module.exports = app;
