'use strict';

const express = require('express');
const router = express.Router();
const request = require('request-promise-native');
const buildURI = require('../buildAuthURI');
const bodyparser = require('body-parser').json();
const qs = require('querystring');
// const User = require('../models/user');
// let access_token = 'ya29.Ci-ZAzcQ20A1kINHQbxNdRHrX057meK_2Uf1Ei9wB7oMn_O1IPITGVnpbk6wdwjsIQ';

const fitScopes = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.activity.write',
  'https://www.googleapis.com/auth/fitness.body.read',
  'https://www.googleapis.com/auth/fitness.body.write',
  'https://www.googleapis.com/auth/fitness.location.read',
  'https://www.googleapis.com/auth/fitness.location.write',
  'https://www.googleapis.com/auth/fitness.nutrition.read',
  'https://www.googleapis.com/auth/fitness.nutrition.write'
];

const tokenURI = 'https://accounts.google.com/o/oauth2/token';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'bad_set_sekrit';
const CLIENT_ID = process.env.CLIENT_ID || '549358026338-cja381ls92s94kuc818132h5ohlg6pif.apps.googleusercontent.com';

let authURI = buildURI(fitScopes, CLIENT_ID);

const oAuthOptions = {
  uri: authURI,
  resolveWithFullResponse: true,
  json: true
};

module.exports = router
  .post('/googleAuth', bodyparser, (req, res, next) => {
    console.log('got to the google auth post route');

    if (!req.body.oauth_token || !req.body.oauth_verifier) {

      request.post(oAuthOptions)
      .then(data => {
        const oauthToken = qs.parse(data);
        console.log(oauthToken);
        res.send(oauthToken);
      })
      .catch(next);
    } else {

      // Part 2 of 2: Second request after Authorize app is clicked.
      const accessTokenOauth = {
        consumer_key: CLIENT_ID,
        consumer_secret: CLIENT_SECRET,
        token: req.body.oauth_token,
        verifier: req.body.oauth_verifier
      };

        // Step 3. Exchange oauth token and oauth verifier for access token.
      request.post({
        uri: tokenURI,
        oauth: accessTokenOauth
      }).then(data => {
        const accessToken = qs.parse(data);
        console.log(accessToken);
        res.send(accessToken);
      })
      .catch(next);
    }
  })

  .get('/googlefit', bodyparser, (req, res, next) => {
    request(options)
      .then(data => {
        console.log(data);
        res.send(JSON.parse(data));
      })
      .catch(next);
  });


  // const options = {
  //   uri: 'https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.step_count.delta:2220c94e:Example+Manufacturer:ExampleTablet:a057bd69:MyDataSource',
  //   qs: {
  //     access_token: `${access_token}` // -> uri + '?access_token=xxxxx%20xxxxx'
  //   },
  //   headers: {
  //     'User-Agent': 'Request-Promise',
  //     'Authorization': `Bearer ${access_token}`
  //   },
  //   json: true // Automatically parses the JSON string in the response
  // };

  // const profileOauth = {
  //   consumer_key: TWITTER_KEY,
  //   consumer_secret: TWITTER_SECRET,
  //   oauth_token: accessToken.oauth_token
  // };

  // const requestTokenOauth = {
  // 	consumer_key: TWITTER_KEY,
  // 	consumer_secret: TWITTER_SECRET,
  // 	callback: req.body.redirectUri
  // };
