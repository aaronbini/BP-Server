const jwt = require('jsonwebtoken');
const secret = process.env.APP_SECRET || 'somestupidword';

module.exports = {
  sign(user) {
    return new Promise((resolve, reject) => {
      jwt.sign({
        id: user._id,
        username: user.username,
        role: user.role,
        hasGoogle: user.google.hasGoogle
      }, secret, null, (error, token) => {
        if (error) return reject(error);
        resolve({token, id: user._id, username: user.username, role: user.role, hasGoogle: user.google.hasGoogle});
      });
    });
  },

  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (error, payload) => {
        if (error) return reject(error);
        resolve(payload);
      });
    });
  }

};
