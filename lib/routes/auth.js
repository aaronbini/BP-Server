'use strict';

const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser').json();
const ensureAuth = require('../auth/ensureAuth');
const token = require('../auth/token.js');
const buildURI = require('../buildAuthURI');
const User = require('../models/user');
const qs = require('querystring');
const request = require('request-promise-native');
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

// const tokenURI = 'https://accounts.google.com/o/oauth2/token';
const getTokenURI = 'https://www.googleapis.com/oauth2/v4/token';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'IxPq836dRBI_HAm5a0lIoXxJ';
const CLIENT_ID = process.env.CLIENT_ID || '549358026338-cja381ls92s94kuc818132h5ohlg6pif.apps.googleusercontent.com';

// let authURI = buildURI(fitScopes, CLIENT_ID);

const oAuthOptions = {
  uri: getTokenURI,
  method: 'POST',
  body: {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: 'http://localhost:8080/config',
    grant_type: 'authorization_code'
  },
  headers: {'content-type': 'application/json'},
  json: true
};

const payload = {
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  grant_type: 'authorization_code'
};

module.exports = router

.post('/google', bodyparser, (req, res, next) => {
  console.log('req.body: ', req.body);
  payload.code = req.body.code;
  payload.redirect_uri = req.body.redirectUri;
  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    console.log('got to the google auth post route if block');

    request.post(getTokenURI, {form: payload})
      .then(data => {
        console.log('data after token rquest: ', data);
        const oauthToken = qs.parse(data);
        console.log('authToken: ', oauthToken);
        res.send(oauthToken);
      })
      .catch(next);
  } else {
    console.log('got to the google auth post route else block');

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

.post('/signup', bodyparser, (req, res, next) => {
  const {email, password, username} = req.body;
  delete req.body.password;

  if(!email || !password || !username) {
    return res.status(400).send({message: 'All fields are required.'});
  }

  User.findOne({email})
    .then(existing => {
      if(existing) return res.status(500).send({message: 'That email is already in use.'});
      const user = new User(req.body);
      user.generateHash(password);
      return user.save()
      .then(user => {
        return token.sign(user);
      })
      .then(token => {
        res.send({token});
      });
    })
    .catch(next);
})

.post('/signin', bodyparser, (req, res, next) => {
  const {email, password} = req.body;
  delete req.body;

  User.findOne({email})
    .then(user => {
      if(!user || !user.compareHash(password)) throw {status: 400, message: 'Invalid email or password.'};
      return token.sign(user)
      .then(token => {
        res.send({token});
      });
    })
    .catch(next);
})

.get('/verify', ensureAuth, (req, res) => {
  res.status(200).send({success: true});
});
