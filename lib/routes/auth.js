'use strict';

//TODO: allow user to revoke access when unsubscribing from app

const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser').json();
const ensureAuth = require('../auth/ensureAuth');
const token = require('../auth/token.js');
const User = require('../models/user');
const request = require('request-promise-native');
const getTokenURI = 'https://www.googleapis.com/oauth2/v4/token';

let accessToken, idToken, refreshToken;

module.exports = router

.post('/google/checkToken', ensureAuth, bodyparser, (req, res, next) => {
  const token = req.body.googleToken;

  request(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`)
    .then(valid => {
      valid = JSON.parse(valid);
      console.log('CLIENT_ID: ', process.env.CLIENT_ID);
      if (!valid.aud === process.env.CLIENT_ID) throw {code: 400, message: 'Invalid Client ID'};
      res.send(valid);
    })
    .catch(next);
})

.post('/google/refresh', bodyparser, (req, res, next) => {

  request.post(getTokenURI, {form: req.body})
    .then(data => {
      res.send(data);
    })
    .catch(next);
})

.post('/google', bodyparser, (req, res, next) => {
  const payload = {
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: req.body.code,
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    prompt: 'consent'
  };

  request.post(getTokenURI, {form: payload})
    .then(data => {
      let parsed = JSON.parse(data);
      accessToken = parsed.access_token;
      idToken = parsed.id_token;
      refreshToken = parsed.refresh_token;
      return request(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`);
    })
    .then(tokenStuff => {
      tokenStuff = JSON.parse(tokenStuff);
      console.log('google stuff: ', tokenStuff);
      //do stuff here like check google email vs. user email, etc.
      return User.findOne({email: tokenStuff.email})
        .then(user => {
          //need to refactor this, on front-end user should have option to signup via google
          //then here new user would need to be created at this point
          if (!user) throw {status: 400, message: 'Cannot find you in our database. Please sign up first.'};
          //attach refresh token to user here
          user.google = {
            refresh: refreshToken,
            hasGoogle: true,
            kid: tokenStuff.kid
          };
          // console.log('user: ', user);
          user.save();
          return token.sign(user);
        });
    })
    .then(token => {
      res.send({access_token: accessToken, id_token: idToken, refresh_token: refreshToken, token});
    })
    .catch(next);
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
        // console.log(user);
        return token.sign(user);
      })
      .then(token => {
        // console.log('token: ', token);
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
