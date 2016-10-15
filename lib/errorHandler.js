'use strict';

function errorHandler (err, req, res, next) {
  console.log('error stack: ', err.stack || err);
  console.log('error message: ', err.message || err);
  res.status(err.status || 500).send({error: err.message || err.error || err});
};

module.exports = errorHandler;
