const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// 1) GLOBAL MIDDELEWARE
// Set security HTTP headers
app.use(helmet())

// Development loggin
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: (req, res) => {
    res
      .status(500)
      .json({ status: 'fail', message: "Too many request from this IP!" })
  }

})
app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization aganist NoSQL query injection
app.use(mongoSanitize());

// Data sanitization aganist XSS
app.use(xss());

// Prevent Parameter Pollution
app.use(hpp({
  whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}));

// Serving static files
app.use(express.static(`${__dirname}/public/`));

// Test MiddleWare
app.use((req, res, next) => {
  // console.log(req.headers)
  next();
})

//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// UNHANDLED ROUTES ERROR HANDLER
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler)

module.exports = app;
