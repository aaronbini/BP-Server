module.exports = function getEnsureMe () {
  return function ensureMe (user, userId) {
    if (user.id != userId) throw {code: 403, message: 'Not authorized.'};
    return true;
  };
};
