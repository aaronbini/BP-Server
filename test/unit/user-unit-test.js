const User = require('../../lib/models/user');
const assert = require('chai').assert;

describe('user model', () => {

  it('requires username when signing up', done => {
    const noUsername = new User ({
      email: 'aaron@gmail.com',
      password: 'test'
    });
    noUsername.validate(err => {
      assert.isOk(err);
      done();
    });
  });

  it('requires password when signing up', done => {
    const noPass = new User({
      email: 'aaron@gmail.com',
      username: 'Aaron'
    });
    noPass.validate(err => {
      assert.isOk(err);
      done();
    });
  });

  it('requires email when signing up', done => {
    const noEmail = new User({
      username: 'Aaron',
      password: 'test'
    });
    noEmail.validate(err => {
      assert.isOk(err);
      done();
    });
  });

  it('signs up user when all is well', done => {
    const goodUser = new User({
      username: 'Aaron',
      password: 'test',
      email: 'aaron@gmail.com'
    });
    goodUser.validate(err => {
      assert.equal(goodUser.role, 'user');
      if (!err) done();
      else done(err);
    });
  });

});
