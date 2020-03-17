const path = require('path');
const express = require('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const fileupload = require('express-fileupload');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
// Load Vars from ENV
dotenv.config({ path: './config/config.env' });

// Connection MongoDB
connectDB();
// INITIALIAZE APP
const app = express();

// Logger
// app.use(logger);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// File Uploading
app.use(fileupload());

// Sanitize Data
app.use(mongoSanitize());

// Set Security headers
app.use(helmet());

// Prevent XSS Attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Prevent Http Params Pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// LOAD ROUTERS
app.use('/api/v1/auth', require('./routers/auth'));
app.use('/api/v1/bootcamps', require('./routers/bootcamps'));
app.use('/api/v1/courses', require('./routers/courses'));
app.use('/api/v1/users', require('./routers/users'));
app.use('/api/v1/reviews', require('./routers/reviews'));

app.use(errorHandler);

// PORT VAR
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `Running Server in ${process.env.NODE_ENV} mode on PORT ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);

  // Close Server && exit process
  server.close(() => process.exit(1));
});
