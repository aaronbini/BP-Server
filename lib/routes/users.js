'use strict';

const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser').json();
const ensureRole = require('../auth/ensureRole');
const User = require('../models/user');
const ensureMe = require('../auth/ensureMe');

module.exports = router

.get('', ensureRole('superUser'), (req,res,next) => {
  User.find()
  .lean()
  .select('-password')
  .then (users => res.send(users))
  .catch(next);
})

.get('/:id', ensureMe('user'), (req,res,next) => {
  User.findById(req.params.id)
  .lean()
  .select('-password')
  .then(user => {
    ensureMe(req.user, user._id);
    res.send(user);
  })
  .catch(next);
})

.put('/setGoals/:id', bodyparser, ensureMe('user'), (req, res, next) => {
  User.findById(req.params.id)
  .then(user => {
    user.setGoals(req.body);
    return user.save();
  })
  .then(user => res.send(user))
  .catch(next);
})

.put('/:id', bodyparser, ensureMe('user'), (req,res,next) => {
  User.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .lean()
  .select('-password')
  .then(user => res.send(user))
  .catch(next);
})

.delete('/:id', ensureMe('user'), (req,res,next) => {
  User.findByIdAndRemove(req.params.id)
  .lean()
  .then(user => res.send(user))
  .catch(next);
});
