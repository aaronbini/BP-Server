function notFound (req, res, next) {
  next({error: `${req.url} does not exist`, status: 404});
};

module.exports = notFound;
