
'use strict';

const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser').json();
const Reading = require('../models/reading');
const categorize = require('../categorize');
const ensureRole = require('../auth/ensureRole');
const ensureMe = require('../auth/ensureMe')();

module.exports = router

.get('', ensureRole('superUser'), (req,res,next) => {
  Reading.find()
  .lean()
  .then (readings => res.send(readings))
  .catch(next);
})

//eslint-disable-next-line no-unused-vars
.get('/stats', (req, res, next) => {
  //set up aggregation here
  //average and mean currently being handled on front-end
  //so may not need this route
})

.get('/:userId/todayCompleted', (req, res, next) => {
  Reading.todayCompleted(req.params.userId)
    .then(completed => res.send(completed))
    .catch(next);
})

.get('/:id', (req,res,next) => {
  Reading.findById(req.params.id)
  .lean()
  .then(reading => {
    ensureMe(req.user, reading.user);
    res.send(reading);
  })
  .catch(next);
})

.get('/byUser/:userId', (req, res, next) => {
  Reading.find({user: req.params.userId})
  .sort({createdAt: 1})
  .then(readings => {
    readings.forEach(reading => {
      ensureMe(req.user, reading.user);
    });
    const categoryCount = categorize(readings);
    res.send({readings, categoryCount});
  })
  .catch(next);
})

.post('/:userId/', bodyparser, (req, res, next) => {
  req.body.user = req.params.userId;
  new Reading(req.body)
   .save()
   .then(reading => res.send(reading))
   .catch(next);
})

//using post here to query so I can pass dateRange as req.body
//rather than a GET with long query params: is this acceptable?
.post('/dateRange/:userId', bodyparser, (req, res, next) => {
  Reading.queryRange(req.params.userId, req.body)
    .then(readings => {
      readings.forEach(reading => {
        ensureMe(req.user, reading.user);
      });
      const categoryCount = categorize(readings);
      res.send({readings, categoryCount});
    })
    .catch(next);
})

.put('/:id', bodyparser, (req,res,next) => {
  Reading.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .then(reading => {
    //this doesn't work because me verifcation happens after put
    ensureMe(req.user, reading.user);
    res.send(reading);
  })
  .catch(next);
})

.delete('/:id', (req,res,next) => {
  Reading.findByIdAndRemove(req.params.id)
  .then(reading => {
    //this doesn't work because me verification happens after delete
    ensureMe(req.user, reading.user);
    res.send(reading);
  })
  .catch(next);
});
