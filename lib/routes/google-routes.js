'use strict';

const express = require('express');
const router = express.Router();
const request = require('request-promise-native');
const bodyparser = require('body-parser').json();
const moment = require('moment');

const fitStats = {
  weight: 'raw:com.google.weight:com.google.android.apps.fitness:user_input',
  steps: 'raw:com.google.step_count.delta:com.google.android.apps.fitness:user_input',
  height: 'raw:com.google.height:com.google.android.apps.fitness:user_input',
  calories: 'raw:com.google.calories.expended:com.google.android.apps.fitness:user_input',
  derivedCalories: 'derived:com.google.calories.expended:com.google.android.gms:from_activities',
  cumulative: 'derived:com.google.step_count.delta:com.google.android.gms:samsung:SCH-I545:5e5a0e51:derive_step_deltas<-raw:com.google.step_count.cumulative:samsung:SCH-I545:5e5a0e51:SAMSUNG Step Counter Sensor'
};

module.exports = router

  .post('/googlestats', bodyparser, (req, res, next) => {
    let now = new Date();
    let then = moment();
    then = then.subtract(2, 'days');
    then = new Date(then._d);
    then = then.getTime() * 1000000;
    now = now.getTime() * 1000000;
    const getData = '/${stepDeltas}/datasets/${then}-${now}';

    //potentially useful, this seems to be cumulative steps
    //but I'm not sure about accuracy
    const cumulative = 'derived:com.google.step_count.delta:com.google.android.gms:samsung:SCH-I545:5e5a0e51:derive_step_deltas<-raw:com.google.step_count.cumulative:samsung:SCH-I545:5e5a0e51:SAMSUNG Step Counter Sensor';
    const prunedDistance = 'derived:com.google.distance.delta:com.google.android.gms:pruned_distance';
    const calories = 'raw:com.google.calories.expended:com.google.android.apps.fitness:user_input';
    const stepDeltas = 'derived:com.google.distance.delta:com.google.android.gms:from_steps<-merge_step_deltas';

    const googleAuth = req.body.googleAuth;
    const options = {
      uri: `https://www.googleapis.com/fitness/v1/users/me/dataSources/${stepDeltas}/datasets/${then}-${now}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Request-Promise',
        'Authorization': `Bearer ${googleAuth}`
      },
      json: true // Automatically parses the JSON string in the response
    };

    request(options)
      .then(response => {
        console.log('response: ', response);
        if (typeof response === 'object') {
          let burnt = response.point.map(e => e.value[0].fpVal)
          .reduce((p,c) => { return p + c; }, 0);
          console.log(burnt);
        }
        res.send(response);
      })
      .catch(next);
  })

  .get('/googlefit', bodyparser, (req, res, next) => {
    request(options)
      .then(data => {
        console.log(data);
        res.send(JSON.parse(data));
      })
      .catch(next);
  });
