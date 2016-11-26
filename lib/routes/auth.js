'use strict';

const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser').json();
const ensureAuth = require('../auth/ensureAuth');
const token = require('../auth/token.js');
const User = require('../models/user');
const request = require('request-promise-native');
const moment = require('moment');

const fitStats = {
  weight: 'raw:com.google.weight:com.google.android.apps.fitness:user_input',
  steps: 'raw:com.google.step_count.delta:com.google.android.apps.fitness:user_input',
  height: 'raw:com.google.height:com.google.android.apps.fitness:user_input',
  calories: 'raw:com.google.calories.expended:com.google.android.apps.fitness:user_input'
};

const getTokenURI = 'https://www.googleapis.com/oauth2/v4/token';
const CLIENT_SECRET = process.env.CLIENT_SECRET /*|| 'IxPq836dRBI_HAm5a0lIoXxJ'*/;
// const CLIENT_ID = process.env.CLIENT_ID /*|| '549358026338-cja381ls92s94kuc818132h5ohlg6pif.apps.googleusercontent.com'*/;

const payload = {
  client_secret: CLIENT_SECRET,
  grant_type: 'authorization_code'
};
let accessToken, idToken, refreshToken;
module.exports = router

.post('/googlestats', bodyparser, (req, res, next) => {
  const now = moment().toISOString();
  const then = moment('2010-01-01').toISOString();
  const start = 1479000000000000000;
  const end = 1479762600000000000;
  const dateNow = 1479799643344000000;
  const getData = '/${prunedDistance}/datasets/${start}-${dateNow}';
  //potentially useful
  const random = 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta';
  const prunedDistance = 'derived:com.google.distance.delta:com.google.android.gms:pruned_distance';

  const googleAuth = 'ya29.CjCeA-37W1PZpa2mBnODuJLCBgRX1kP7vFLzPEEsYnS5AbKP2c2R88HgWJcH-U6Up44';
  const options = {
    uri: `https://www.googleapis.com/fitness/v1/users/me/dataSources/${prunedDistance}/datasets/${start}-${dateNow}`,
    method: 'GET',
    headers: {
      'User-Agent': 'Request-Promise',
      'Authorization': `Bearer ${googleAuth}`
    },
    json: true // Automatically parses the JSON string in the response
  };

  console.log('about to make request');

  request(options)
    .then(response => {
      // console.log(response.point.length);
      res.send(response);
    })
    .catch(next);
})

//add front-end google service call to this endpoint to handle token refresh
.post('/google/checkToken', ensureAuth, bodyparser, (req, res, next) => {
  const token = req.body.googleToken;
  console.log(process.env.CLIENT_ID);

  request(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`)
    .then(valid => {
      valid = JSON.parse(valid);
      if (!valid.aud === process.env.GOOGLE_CLIENT_ID) throw {code: 400, message: 'Invalid Google Auth Token'};
      res.send(valid);
    })
    .catch(next);
})

.post('/google', bodyparser, (req, res, next) => {
  console.log(req.body);
  payload.code = req.body.code;
  payload.client_id = req.body.clientId;
  payload.redirect_uri = req.body.redirectUri;
  // payload.access_type = req.body.accessType;

  request.post(getTokenURI, {form: payload})
    .then(data => {
      let parsed = JSON.parse(data);
      console.log(parsed);
      accessToken = parsed.access_token;
      idToken = parsed.id_token;
      refreshToken = parsed.refresh_token;
      return request(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`);
    })
    .then(tokenStuff => {
      tokenStuff = JSON.parse(tokenStuff);
      //do stuff here like check google email vs. user email, etc.
      return User.findOne({email: tokenStuff.email})
        .then(user => {
          if (!user) throw {status: 400, message: 'Cannot find you in our database. Please sign up first.'};
          //attach refresh token to user here
          user.refresh = refreshToken;
          user.save();
          return token.sign(user);
        });
    })
    .then(token => {
      console.log('refresh token: ', refreshToken);
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

// const oAuthOptions = {
//   uri: getTokenURI,
//   method: 'POST',
//   body: {
//     client_id: CLIENT_ID,
//     client_secret: CLIENT_SECRET,
//     redirect_uri: 'http://localhost:8080/config',
//     grant_type: 'authorization_code'
//   },
//   headers: {'content-type': 'application/json'},
//   json: true
// };

// body: {
//   "dataStreamName": "MyDataSource",
//   "type": "derived",
//   "application": {
//     "detailsUrl": "http://example.com",
//     "name": "Foo Example App",
//     "version": "1"
//   },
//   "dataType": {
//     "field": [
//       {
//         "name": "steps",
//         "format": "integer"
//       }
//     ],
//     "name": "com.google.step_count.delta"
//   },
//   "device": {
//     "manufacturer": "Example Manufacturer",
//     "model": "ExampleTablet",
//     "type": "tablet",
//     "uid": "1000001",
//     "version": "1.0"
//   }
// }
