const Reading = require('../models/reading');
const User = require('../models/user');

module.exports = function getEnsureMe (endpoint) {
  return function ensureMe (req, res, next) {
    if (endpoint === 'reading') {
      Reading.findById(req.params.id)
        .then(reading => {
          if (reading.user == req.user.id) return next();
          return next({code: 403, message: 'Not authorized.'});
        });
    } else if (endpoint === 'user') {
      User.findById(req.params.id)
        .then(user => {
          if (user._id == req.user.id) return next();
          return next({code: 403, message: 'Not authorized.'});
        });
    }
  };
};
