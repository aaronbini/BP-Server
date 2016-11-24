'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const User = new Schema({
  firstname: String,
  lastname: String,
  age: Number,
  username: {
    type:String,
    required: true
  },
  email: {
    type:String,
    required: true
  },
  password: {
    type:String,
    required: true
  },
  perWeek: Number,
  sysGoal: Number,
  diaGoal: Number,
  hoursSleep: Number,
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
  this.sysGoal = goals.sysGoal;
  this.diaGoal = goals.diaGoal;
  this.perWeek = goals.perWeek;
  this.hoursSleep = goals.hoursSleep;
  return this;
};

module.exports = mongoose.model('User', User);
