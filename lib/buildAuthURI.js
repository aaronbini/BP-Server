// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const CLIENT_ID = process.env.CLIENT_ID || '549358026338-cja381ls92s94kuc818132h5ohlg6pif.apps.googleusercontent.com';

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
