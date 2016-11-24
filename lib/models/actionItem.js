'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const moment = require('moment');

const ActionItem = new Schema({
  summary: {
    type: String,
    required: true
  },
  dateDue: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {timestamps: true});

ActionItem.statics.getOverdueAndDue = function (userId) {
  //this will need to be re-vamped
  return this.find({user: userId})
    .then(item => {
      return item.dateDue;
    });
};

//use MongoDB data aggregation to allow user to view avg. readings for different time blocks
//i.e. over last month, last week, last two months, etc.
//or could use map/reduce in MongoDB, or just plain JavaScript reduce

module.exports = mongoose.model('ActionItem', ActionItem);
