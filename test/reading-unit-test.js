const Reading = require('../lib/models/reading');
const assert = require('chai').assert;

describe('reading model', () => {

  it('requires systolic', done => {
    const noSys = new Reading ({
      diastolic: 65
    });
    noSys.validate(err => {
      assert.isOk(err);
      done();
    });
  });

  it('requires diastolic', done => {
    const noDia = new Reading({
      systolic: 125
    });
    noDia.validate(err => {
      assert.isOk(err);
      done();
    });
  });

  it('adds reading when all required fields provided', done => {
    const goodReading = new Reading ({
      systolic: 125,
      diastolic: 65
    });
    goodReading.validate(err => {
      if (!err) done();
      else done(err);
    });
  });

});
