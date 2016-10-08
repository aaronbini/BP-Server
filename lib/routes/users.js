'use strict';

const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser').json();

const User = require('../models/user');

module.exports = router

.get('', (req,res,next) => {
  User.find()
  .lean()
  .select('-password')
  .then ( data => res.send(data) )
  .catch( err => {
    console.log('error getting user list');
    console.log(err);
    next(err);
  });
})

.get('/:id', (req,res,next) => {
  User.findById(req.params.id)
  .lean()
  .select('-password')
  .then( data => res.send(data) )
  .catch( err => {
    console.log('error getting an user by id');
    console.log(err);
    next(err);
  });
})

.post('', bodyparser, (req,res,next) => {
  const newUser = new User(req.body);
  newUser.generateHash(req.body.password); // this replaces the plain text password with a hash
  newUser.save()
  // .select('-password')
  .then( user => res.send(user) )
  .catch( next );
})

.put('/:id/approvals', bodyparser, (req,res,next) => {
  User.changeApprovals(req.body.add, req.body.remove, req.params.id)
  .then( user => {
    res.send(user);
  })
  .catch( next );
})

.put('/:id', bodyparser, (req,res,next) => {
  User.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .lean()
  .select('-password')
  .then( user => res.send(user) )
  .catch( next );
})

.delete('/:id', (req,res,next) => {
  User.findByIdAndRemove(req.params.id)
  .lean()
  .then( data => {
    if(!data) return Promise.reject(data);
    res.send(data);
  })
  .catch( next );
});
