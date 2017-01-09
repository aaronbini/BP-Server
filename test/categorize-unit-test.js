const categorize = require('../lib/categorize');
const assert = require('chai').assert;

describe('categorize unit test', () => {
  const readings = [
    {
      systolic: 119,
      diastolic: 65
    },
    {
      systolic: 131,
      diastolic: 65
    },
    {
      systolic: 125,
      diastolic: 75
    },
    {
      systolic: 142,
      diastolic: 80
    }
  ];

  it('properly categorizes readings', () => {
    const tally = categorize(readings);
    assert.equal(tally.good, 1);
    assert.equal(tally.pre, 2);
    assert.equal(tally.hypI, 1);
  });
});
