const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const logger = require('./middleware/logger');
// Load Vars from ENV
dotenv.config({ path: './config/config.env' });

// INITIALIAZE APP
const app = express();

// Logger
app.use(logger);

// LOAD ROUTERS
app.use('/api/v1/bootcamps', require('./routers/bootcamps'));
// PORT VAR
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Running Server in ${process.env.NODE_ENV} mode on PORT ${PORT}`.yellow.bold
  )
);
