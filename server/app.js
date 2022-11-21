const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const config = require('./config');
const AppError = require('./utils/AppError');
const errorController = require('./controllers/errorController');
const authRouter = require('./routes/authRouter');
const jobRouter = require('./routes/jobRouter');

const app = express();

//MIDDLEWARE
if (config.env === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, '../client/build')));
const corsOptions = {
  origin: config.clientUrl,
  methods: 'GET,POST,PATCH,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser(config.cookieSecret));

//FOR SECURITY
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
// 避免參數汙染:query一堆重複的field
app.use(
  hpp({
    whitelist: ['company', 'position', 'jobType', 'company', 'jobLocation'],
  })
);

const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

//ROUTES

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', limiter, jobRouter);

app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html')));

app.use(errorController);

module.exports = app;
