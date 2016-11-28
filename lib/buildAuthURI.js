module.exports = function buildAuthURI (scopes, id) {
  let baseString = 'https://accounts.google.com/o/oauth2/auth';
  let redirect_URI = 'http://localhost:8080/config';
  // let redirect_URI = 'https://www.getpostman.com/oauth2/callback';
  baseString += `?redirect_uri=${redirect_URI}&response_type=code&`;
  baseString += `client_id=${id}&scope=`;
  let fullURI = scopes.reduce((prev, curr) => {
    return `${prev}${curr}+`;
  }, baseString);
  return fullURI.slice(0, fullURI.length-1);

};
