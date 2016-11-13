const ActionItem = require('../../lib/models/actionItem');
const assert = require('chai').assert;

describe('Action Item Model', () => {

  it('requires summary', done => {
    const noSummary = new ActionItem({
      dateDue: '2016-11-14'
    });
    noSummary.validate(err => {
      assert.isOk(err);
      done();
    });
  });

  it('requires due date', done => {
    const noDueDate = new ActionItem({
      summary: 'Do the thing'
    });
    noDueDate.validate(err => {
      assert.isOk(err);
      done();
    });
  });

  it('adds a valid action item and defaults completed to false', done => {
    const goodAction = new ActionItem({
      summary: 'Do that important thing.',
      dateDue: '2016-11-15'
    });
    goodAction.validate(err => {
      assert.equal(goodAction.completed, false);
      if (!err) done();
      else done(err);
    });
  });

});
