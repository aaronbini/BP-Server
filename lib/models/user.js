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
  countGoal: Number,
  sysGoal: Number,
  diaGoal: Number,
  role: {
    type: String,
    default: 'user'
  }
}, {timestamps: true});

user.methods.generateHash = function(password){
  return this.password = bcrypt.hashSync(password, 8);
};

user.methods.compareHash = function(password){
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', User);
