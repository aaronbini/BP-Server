
'use strict';

const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser').json();

const ActionItem = require('../models/actionItem');

module.exports = router

  .get('', (req,res,next) => {
    ActionItem.find()
    .lean()
    .populate('company')
    .then ( actionItems => res.send(actionItems) )
    .catch(next);
  })

  .get('/:id', (req,res,next) => {
    ActionItem.findById(req.params.id)
    .populate('company')
    .populate('position')
    .lean()
    .then( actionItem => res.send(actionItem) )
    .catch(next);
  })

  .get('/byUser/:userId/overdue', (req, res, next) => {
    //this will need to be re-vamped
    ActionItem.getOverdueAndDue(req.params.userId)
    .then(dateDue => res.send(dateDue))
    .catch(next);
  })

  .get('/byUser/:userId', (req, res, next) => {
    ActionItem.find({user: req.params.userId})
    .then(actionItems => res.send(actionItems))
    .catch(next);
  })

  .post('/:userId/', bodyparser, (req, res, next) => {
    req.body.user = req.params.userId;
    new ActionItem(req.body)
     .save()
     .then( actionItem => res.send(actionItem) )
     .catch(next);
  })

  .put('/completed/:id', bodyparser, (req,res,next) => {
    ActionItem.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(actionItem => res.send(actionItem))
    .catch(next);
  })

  .put('/:id', bodyparser, (req,res,next) => {
    ActionItem.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then(actionItem => res.send(actionItem))
    .catch(next);
  });
