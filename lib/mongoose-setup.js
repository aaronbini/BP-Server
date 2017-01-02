'use strict';

const mongoose = require('mongoose');

// we need a URI that points to our database
const dbURI = 'mongodb://localhost/bpTracker';
// const dbURI = 'process.env.MONGODB_URI || mongodb://heroku_69cxcwhl:j36l32dtgbl9m9qs4jf4fnimn0@ds119718.mlab.com:19718/heroku_69cxcwhl';

mongoose.Promise = Promise;
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = mongoose.connection;
