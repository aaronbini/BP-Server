'use strict';

function categorize (readings) {

  return readings.reduce((accumulator, reading) => {
    if (reading.systolic <= 119 && reading.diastolic <= 79) {
      accumulator.good++;
    } else if (reading.systolic <= 139 && reading.diastolic <= 89) {
      accumulator.pre++;
    } else if (reading.systolic <= 159 && reading.diastolic <= 99) {
      accumulator.hypI++;
    } else if (reading. systolic <= 179 && reading.diastolic <= 109) {
      accumulator.hypII++;
    } else {
      accumulator.crisis++;
    }
    return accumulator;
  }, {good: 0, pre: 0, hypI: 0, hypII: 0, crisis: 0});
}

module.exports = categorize;
