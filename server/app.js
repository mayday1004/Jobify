const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome!');
});

app.get('*', (req, res) => {
  res.status(404).send('404 not found');
});

module.exports = app;
