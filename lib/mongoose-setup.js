'use strict';

const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/bpTracker';

mongoose.Promise = Promise;

mongoose.connect(dbURI, function(err) {
  if (err) {
    console.log('Failed connecting to Mongodb!');
  } else if(process.env.NODE_ENV != 'test') { // for testing, success should be silent
    console.log('Successfully connected to Mongodb on ' + dbURI);
  }
});

module.exports = mongoose;
