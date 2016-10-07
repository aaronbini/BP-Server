
'use strict';

const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');

const ActionItem = require('../models/actionItem');

module.exports = router

.get('', (req,res,next) => {
  ActionItem.find()
  .lean()
  .populate('company')
  .then ( actionItems => res.send(actionItems) )
  .catch( err => {
    console.log('error getting full actionItem list');
    console.log(err);
    next(err);
  });
})

.get('/:id', (req,res,next) => {
  ActionItem.findById(req.params.id)
  .populate('company')
  .populate('position')
  .lean()
  .then( actionItem => res.send(actionItem) )
  .catch( err => {
    console.log('error getting an actionItem by id');
    console.log(err);
    next(err);
  });
})

.get('/byUser/:userId/overdue', (req, res, next) => {
  ActionItem.getOverdueAndDue(req.params.userId)
  .then(actionItems => res.send(actionItems))
  .catch(err => {
    console.log('error getting overdue and due actionItems');
    console.log(err);
    next(err);
  });
})

.get('/byUser/:userId', (req, res, next) => {
  ActionItem.findByUser(req.params.userId)
  .then(actionItems => res.send(actionItems))
  .catch(err => {
    console.log('error getting an actionItem by userId');
    console.log(err);
    next(err);
  });
})

.get('/byPosOrComp/:id/:which', (req, res, next) => {
  ActionItem.findByPosOrComp(req.params.which, req.params.id)
  .then(actionItems => res.send(actionItems))
  .catch(err => {
    console.log('error getting an actionItem By Position Or Company:', req.params.which, req.params.id);
    console.log(err);
    next(err);
  });
})

.post('/:userId/', bodyparser, (req, res, next) => {
  req.body.user = req.params.userId;
  if (req.body.company === '') {delete req.body.company;}
  if (req.body.position === '') {delete req.body.position;}
  new ActionItem(req.body)
   .save()
   .then( actionItem => {
     return ActionItem.populate(actionItem, {path: 'position'});
   })
   .then(actionItem => {
     return ActionItem.populate(actionItem, {path: 'company'});
   })
   .then( actionItem => res.send(actionItem) )
   .catch( error => {
     console.log('error creating a new actionItem');
     console.log(error);
     next(error);
   });
})

.put('/:id', bodyparser, (req,res,next) => {
  ActionItem.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .populate('company')
  .then( actionItem => res.send(actionItem) )
  .catch( error => {
    console.log('error updating an action item');
    console.log(error);
    next(error);
  });
})

.delete('/:id', (req,res,next) => {
  ActionItem.findByIdAndRemove(req.params.id)
  .then( actionItem => res.send(actionItem) )
  .catch( error => {
    console.log('error deleting an action item');
    console.log(error);
    next(error);
  });
})
;
