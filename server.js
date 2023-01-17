const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');
const DB = process.env.MONGO_URL.replace(
  '<PASSWORD>',
  process.env.MONGO_PASSWORD
);

mongoose
  // .connect(process.env.MONGO_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }).then(con => console.log('DB connection established'));


// START SERVER
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION!🔥 Shutting down...')
  server.close(() => {
    process.exit(1);
  })
})

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!🔥 Shutting down...')
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  })
})
