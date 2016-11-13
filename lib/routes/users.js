'use strict';

const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser').json();
const ensureRole = require('../auth/ensureRole');
const User = require('../models/user');

module.exports = router

.get('', (req,res,next) => {
  User.find()
  .lean()
  .select('-password')
  .then (user => res.send(user))
  .catch(next);
})

.get('/:id', (req,res,next) => {
  User.findById(req.params.id)
  .lean()
  .select('-password')
  .then(user => res.send(user))
  .catch(next);
})

.put('/setGoals/:userId', bodyparser, (req, res, next) => {
  User.findById(req.params.userId)
  .then(user => {
    user.setGoals(req.body);
    return user.save();
  })
  .then(user => res.send(user))
  .catch(next);
})

.post('', bodyparser, (req,res,next) => {
  const newUser = new User(req.body);
  newUser.generateHash(req.body.password);
  newUser.save()
  .select('-password')
  .then(user => res.send(user))
  .catch(next);
})

.put('/:id', bodyparser, (req,res,next) => {
  User.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .lean()
  .select('-password')
  .then(user => res.send(user))
  .catch(next);
})

.delete('/:id', ensureRole('admin'), (req,res,next) => {
  User.findByIdAndRemove(req.params.id)
  .lean()
  .then(user => {
    if(!user) throw {message: 'Error deleting user.', code: 500};
    res.send(user);
  })
  .catch(next);
});
