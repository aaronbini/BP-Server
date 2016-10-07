'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const ActionItem = new Schema({
  createdAt: {type: Date, default: Date.now},
  systolic: {type: Number},
  diastolic: {type: Number},
  category: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {timestamps: true});


//restrict user to one entry per day?
//could do this on front-end by removing inputs each day once user enters their Reading
//use MongoDB data aggregation to allow user to view avg. readings for different time blocks
//i.e. over last month, last week, last two months, etc.
//or could use map/reduce in MongoDB, or just plain JavaScript reduce

//chart sys over dia over time on same graph

module.exports = mongoose.model('ActionItem', ActionItem);
