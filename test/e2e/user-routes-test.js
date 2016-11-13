const request = require('../request');
const assert = require('chai').assert;
const signupPath = '/api/auth/signup';
const userPath = '/api/users';

describe('user routes', () => {
  const superUser = {username: 'Jimmy', email: 'jimmy@gmail.com', password: 'pass', role: 'superUser'};

  /* eslint-disable no-unused-vars */
  let token = '';
  let userId = '';
  /* eslint-enable */


  before(done => {
    request
      .post(signupPath)
      .send(superUser)
      .then((res) => {
        assert.ok(token = res.body.token.token);
        request
          .get(userPath)
          .set('Authorization', token)
          .then(res => {
            //should re-structure tests because they're brittle currently
            //users, readings, etc. created in other test files live on here
            userId = res.body[3]._id;
            done();
          })
          .catch(done);
      });
  });

  it('gets all users if requesting user is a superUser', done => {
    request
      .get(`${userPath}`)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body[3].username, superUser.username);
        done();
      })
      .catch(done);
  });

  it('gets user by id', done => {
    request
      .get(`${userPath}/${userId}`)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body.email, superUser.email);
        done();
      })
      .catch(done);
  });

  it('sets users goals', done => {
    const userGoals = {sysGoal: 125, diaGoal: 65, perWeek: 7, hoursSleep: 8};
    request
      .put(`${userPath}/setGoals/${userId}`)
      .send(userGoals)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body.sysGoal, userGoals.sysGoal);
        done();
      })
      .catch(done);
  });

  it('edits a user', done => {
    const userChange = {perWeek: 6};
    request
      .put(`${userPath}/${userId}`)
      .send(userChange)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body.perWeek, userChange.perWeek);
        done();
      })
      .catch(done);
  });

  it('deletes user if requesting user is superUser', done => {
    request
      .delete(`${userPath}/${userId}`)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body.email, superUser.email);
        done();
      })
      .catch(done);
  });

});
