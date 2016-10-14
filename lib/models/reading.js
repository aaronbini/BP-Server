'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const Reading = new Schema({
  systolic: {type: Number},
  diastolic: {type: Number},
  category: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {timestamps: true});

Reading.statics.todayCompleted = function (userId) {
  const beginningToday = moment().startOf('day');
  const endToday = moment().endOf('day');
  return this.find({
    user: userId,
    createdAt: {
      $gte: beginningToday.toDate(),
      $lt: endToday.toDate()
    }
  })
  .then(readings => {
    if (readings.length) return {todayCompleted: true, reading: readings[0]};
    return {todayCompleted: false};
  });
};

Reading.statics.queryRange = function (userId, range) {
  //hacky solution to correct for Greenwich Mean time
  //subtract 7 hours from start date to get to midnight
  //add 17 hours to end date to get to midnight
  //if start is Oct. 10 and end is Oct. 11, this will result in
  //12:00 AM Oct 10 to 11:59 PM Oct 11 (48 hours);
  const start = moment(range.fromDate).subtract(7, 'hours');
  const end = moment(range.toDate).add(17, 'hours');
  console.log('start: ', start);
  console.log('end', end);
  return this.find({
    user: userId,
    createdAt: {
      $gte: start.toDate(),
      $lte: end.toDate()
    }
  })
  .then(readings => {
    if (readings.length) return readings;
    return 'No readings in that range.';
  });
};

module.exports = mongoose.model('Reading', Reading);
