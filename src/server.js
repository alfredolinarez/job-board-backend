const express = require('express');
const cors = require('cors');
const { resolve } = require('path');

const app = express();

require('./models');

app.use(cors());
app.use(express.json());
app.use('/public', express.static(resolve(__dirname, '../public')));
app.use(require('./routes'));

module.exports = app;
