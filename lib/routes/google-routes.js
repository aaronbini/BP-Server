'use strict';

const express = require('express');
const router = express.Router();
const request = require('request-promise-native');
const bodyparser = require('body-parser').json();
const moment = require('moment');

let now = moment().endOf('week');
let then = moment().startOf('week');

now = new Date(now._d);
then = new Date(then._d);

now = now.getTime();
then = then.getTime();

module.exports = router
    
  .post('/stats', bodyparser, (req, res, next) => {

    const stats = {
      steps: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
      calories: 'derived:com.google.calories.expended:com.google.android.gms:from_activities',

    };


    const aggregate =  {
      aggregateBy: [{
        dataTypeName: 'com.google.step_count.delta',
        dataSourceId: stats[req.body.category]
      }],
      bucketByTime: {durationMillis: 86400000},
      startTimeMillis: then,
      endTimeMillis: now
    };

    const aggregation = {
      uri: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
      method: 'POST',
      headers: {
        'User-Agent': 'Request-Promise',
        'Authorization': `Bearer ${req.body.googleAuth}`
      },
      body: aggregate,
      json: true // Automatically parses the JSON string in the response
    };

    let agg;
    request(aggregation)
      .then(response => {
        agg = response.bucket.map(e => {
          if (e.dataset[0].point[0]) {
            return e.dataset[0].point[0].value[0].intVal || e.dataset[0].point[0].value[0].fpVal;
          }
          return 0;
        })
        .reduce((prev, curr, i) => {
          let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
          prev[days[i]] = curr;
          return prev;
        }, {});
        const sendObj = {};
        sendObj[req.body.category] = agg;
        res.send({sendObj, then, now, category: req.body.category});
      })
      .catch(next);
  })

  .get('/datasources', bodyparser, (req, res, next) => {
    let token = req.headers.authorization;
    const dataSources = {
      uri: 'https://www.googleapis.com/fitness/v1/users/me/dataSources',
      method: 'GET',
      headers: {
        'User-Agent': 'Request-Promise',
        'Authorization': token
      },
      json: true // Automatically parses the JSON string in the response
    };
    request(dataSources)
      .then(data => {
        res.send(data);
      })
      .catch(next);
  });

  // const getData = '/${fitStats.cumulative}/datasets/${then}-${now}';

  //potentially useful, this seems to be cumulative steps
  //but I'm not sure about accuracy
  // const cumulative = 'derived:com.google.step_count.delta:com.google.android.gms:samsung:SCH-I545:5e5a0e51:derive_step_deltas<-raw:com.google.step_count.cumulative:samsung:SCH-I545:5e5a0e51:SAMSUNG Step Counter Sensor';
  // const prunedDistance = 'derived:com.google.distance.delta:com.google.android.gms:pruned_distance';
  // const calories = 'raw:com.google.calories.expended:com.google.android.apps.fitness:user_input';
  // const stepDeltas = 'derived:com.google.distance.delta:com.google.android.gms:from_steps<-merge_step_deltas';

  // const fitStats = {
  //   weight: 'raw:com.google.weight:com.google.android.apps.fitness:user_input',
  //   steps: 'raw:com.google.step_count.delta:com.google.android.apps.fitness:user_input',
  //   height: 'raw:com.google.height:com.google.android.apps.fitness:user_input',
  //   calories: 'raw:com.google.calories.expended:com.google.android.apps.fitness:user_input',
  //   derivedCalories: 'derived:com.google.calories.expended:com.google.android.gms:from_activities',
  //   cumulative: 'derived:com.google.step_count.delta:com.google.android.gms:samsung:SCH-I545:5e5a0e51:derive_step_deltas<-raw:com.google.step_count.cumulative:samsung:SCH-I545:5e5a0e51:SAMSUNG Step Counter Sensor'
  // };
