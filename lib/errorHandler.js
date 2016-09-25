function errorHandler (err, req, res) {
  if (req.method !== 'POST' && req.method !== 'GET' && req.method !== 'PUT' && req.method !== 'DELETE') {
    res.status(405).send({error: 'That action is not supported here.'});
  } else {
    res.status(err.status || 500).send({error: err.message || err.error || err});
  }
};

module.exports = errorHandler;
