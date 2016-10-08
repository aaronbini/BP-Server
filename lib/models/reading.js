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
    console.log('reading: ', readings);
    if (readings.length) return {todayCompleted: true, reading: readings[0]};
    return {todayCompleted: false};
  });
};

//use MongoDB data aggregation to allow user to view avg. readings for different time blocks
//i.e. over last month, last week, last two months, etc.
//or could use map/reduce in MongoDB, or just plain JavaScript reduce

//chart sys over dia over time on same graph

module.exports = mongoose.model('Reading', Reading);
