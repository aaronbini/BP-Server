
'use strict';

const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser').json();
const Reading = require('../models/reading');

module.exports = router

.get('', (req,res,next) => {
  Reading.find()
  .lean()
  .populate('company')
  .then ( readings => res.send(readings) )
  .catch( err => {
    console.log('error getting full reading list');
    console.log(err);
    next(err);
  });
})

.get('/:id/todayCompleted', (req, res, next) => {
  console.log('got into the route');
  Reading.todayCompleted(req.params.id)
    .then(completed => res.send(completed))
    .catch(err => {
      console.log(err);
      next(err);
    });
})

.get('/:id', (req,res,next) => {
  Reading.findById(req.params.id)
  .populate('company')
  .populate('position')
  .lean()
  .then( reading => res.send(reading) )
  .catch( err => {
    console.log('error getting an reading by id');
    console.log(err);
    next(err);
  });
})

.get('/byUser/:userId/overdue', (req, res, next) => {
  Reading.getOverdueAndDue(req.params.userId)
  .then(readings => res.send(readings))
  .catch(err => {
    console.log('error getting overdue and due readings');
    console.log(err);
    next(err);
  });
})

.get('/byUser/:userId', (req, res, next) => {
  Reading.find({user: req.params.userId})
  .then(readings => res.send(readings))
  .catch(err => {
    console.log('error getting an reading by userId');
    console.log(err);
    next(err);
  });
})

.get('/byPosOrComp/:id/:which', (req, res, next) => {
  Reading.findByPosOrComp(req.params.which, req.params.id)
  .then(readings => res.send(readings))
  .catch(err => {
    console.log('error getting an reading By Position Or Company:', req.params.which, req.params.id);
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
     console.log('error saving new reading');
     console.log(error);
     next(error);
   });
})

.put('/:id', bodyparser, (req,res,next) => {
  Reading.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .populate('company')
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
})
;
