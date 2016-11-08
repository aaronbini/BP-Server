'use strict';

function categorize (readings) {
  const count = {
    good: 0,
    pre: 0,
    hypI: 0,
    hypII: 0,
    crisis: 0
  };
  readings.forEach(reading => {
    if (reading.systolic <= 119 && reading.diastolic <= 79) {
      count.good++;
    } else if (reading.systolic <= 139 && reading.diastolic <= 89) {
      count.pre++;
    } else if (reading.systolic <= 159 && reading.diastolic <= 99) {
      count.hypI++;
    } else if (reading. systolic <= 179 && reading.diastolic <= 109) {
      count.hypII++;
    } else {
      count.crisis++;
    }
  });
  return count;
}

module.exports = categorize;
