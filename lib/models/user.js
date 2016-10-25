'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const bcrypt = require('bcrypt');

const User = new Schema({
  firstname: String,
  lastname: String,
  age: Number,
  username: String,
  email: String,
  password: String,
  perWeek: Number,
  sysGoal: Number,
  diaGoal: Number,
  role: {
    type: String,
    default: 'user'
  }
}, {timestamps: true});

User.methods.generateHash = function(password){
  return this.password = bcrypt.hashSync(password, 8);
};

User.methods.compareHash = function(password){
  return bcrypt.compareSync(password, this.password);
};

User.methods.setGoals = function(goals) {
  this.sysGoal = goals.sys;
  this.diaGoal = goals.dia;
  this.perWeek = goals.perWeek;
  return this;
};

module.exports = mongoose.model('User', User);
