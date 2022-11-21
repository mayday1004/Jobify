const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

exports.env = process.env.NODE_ENV || 'production';
exports.port = process.env.PORT || '5000';
exports.db = process.env.DATABASE;
exports.clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
exports.cookieSecret = process.env.COOKIE_SECRET;
exports.cookieMaxAge = +process.env.COOKIE_MAX_AGE || 604800000;
exports.jwtSecret = process.env.JWT_SECRET;
exports.jwtMaxAge = process.env.JWT_MAX_AGE || '7d';
