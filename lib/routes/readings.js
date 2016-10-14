
'use strict';

const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser').json();
const Reading = require('../models/reading');

module.exports = router

.get('', (req,res,next) => {
  Reading.find()
  .lean()
  .then ( readings => res.send(readings) )
  .catch( err => {
    console.log('error getting full reading list');
    console.log(err);
    next(err);
  });
})

.get('/:id/todayCompleted', (req, res, next) => {
  Reading.todayCompleted(req.params.id)
    .then(completed => res.send(completed))
    .catch(err => {
      console.log(err);
      next(err);
    });
})

.get('/:id', (req,res,next) => {
  Reading.findById(req.params.id)
  .lean()
  .then( reading => res.send(reading) )
  .catch( err => {
    console.log('error getting a reading by id');
    console.log(err);
    next(err);
  });
})

.get('/byUser/:userId', (req, res, next) => {
  Reading.find({user: req.params.userId})
  .sort({createdAt: 1})
  .then(readings => res.send(readings))
  .catch(err => {
    console.log('error getting a reading by userId');
    console.log(err);
    next(err);
  });
})

.post('/dateRange/:userId', bodyparser, (req, res, next) => {
  Reading.queryRange(req.params.userId, req.body)
    .then(readings => res.send(readings))
    .catch(err => {
      console.log(err);
      next(err);
    });
})

.post('/:userId/', bodyparser, (req, res, next) => {
  req.body.user = req.params.userId;
  new Reading(req.body)
   .save()
   .then(reading => res.send(reading))
   .catch(error => {
     console.log(error);
     next(error);
   });
})

.put('/:id', bodyparser, (req,res,next) => {
  Reading.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .then( reading => res.send(reading) )
  .catch( error => {
    console.log('error updating a reading');
    console.log(error);
    next(error);
  });
})

.delete('/:id', (req,res,next) => {
  Reading.findByIdAndRemove(req.params.id)
  .then( reading => res.send(reading) )
  .catch( error => {
    console.log('error deleting a reading');
    console.log(error);
    next(error);
  });
});
