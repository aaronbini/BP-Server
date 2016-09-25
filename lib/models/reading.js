'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var sortReadings = function(a,b) {
  return b.createdAt - a.createdAt;
};

var ReadingSchema = new Schema({
  createdAt: {type: Date, default: Date.now},
  systolic: {type: Number},
  diastolic: {type: Number},
  category: String
});

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  age: Number,
  signUpDate: {type: Date, default: Date.now},
  userName: String,
  passWord: String,
  readings: [ReadingSchema]
});

UserSchema.pre('save', function(next){
  this.readings.sort(sortReadings);
  next();
});

var User = mongoose.model('User', UserSchema);

module.exports.User = User;

/* User: {
            firstName: String,
            lastName: String,
            age: Number,
            signUpDate: Date,
            username: String,
            password: String,
            _ID: String (automatically provided?),
            readings: [
              {
                _id: String
                createdAt: Date,
                systolic: Number,
                diastolic: Number,
              },
              {
                _id: String
                createdAt: Date,
                systolic: Number,
                diastolic: Number,
              },
              {
                _id: String
                createdAt: Date,
                systolic: Number,
                diastolic: Number,
              },
              {
                _id: String
                createdAt: Date,
                systolic: Number,
                diastolic: Number,
              }
            ]
          } */
