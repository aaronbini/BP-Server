const request = require('../request');
const assert = require('chai').assert;
const signupPath = '/api/auth/signup';
const actionPath = '/api/actionItems';
const userPath = '/api/users';

describe('action item routes', () => {
  const testUser = {username: 'Aaron', email: 'aaron@gmail.com', password: 'pass', role: 'superUser'};
  const testAction = {summary: 'Do that important thing.', dateDue: '2016-11-13'};

  //eslint-disable-next-line no-unused-vars
  let token = '';
  let userId = '';

  before(done => {
    request
      .post(signupPath)
      .send(testUser)
      .then((res) => {
        assert.ok(token = res.body.token.token);
        request
          .get(userPath)
          .set('Authorization', token)
          .then(res => {
            userId = res.body[0]._id;
            done();
          })
          .catch(done);
      });
  });

  it('posts an action item', done => {
    request
      .post(`${actionPath}/${userId}`)
      .set('Authorization', token)
      .send(testAction)
      .then(res => {
        assert.equal(res.status, 200);
        assert.ok(res.body);
        assert.ok(res.body._id);
        assert.ok(res.body.createdAt);
        done();
      })
      .catch(done);
  });

  it('gets all action items', done => {
    request
      .get(actionPath)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.ok(res.body[0]._id);
        testAction._id = res.body[0]._id;
        done();
      })
      .catch(done);
  });

  it('gets an action item by id', done => {
    request
      .get(`${actionPath}/${testAction._id}`)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(testAction._id, res.body._id);
        done();
      })
      .catch(done);
  });

  it('gets an action item by user', done => {
    request
      .get(`${actionPath}/byUser/${userId}`)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body[0].user, userId);
        done();
      })
      .catch(done);
  });

  it('gets a users overdue action items', done => {
    request
      .get(`${actionPath}/byUser/${userId}/overdue`)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {});
        done();
      })
      .catch(done);
  });

  it('updates an action item', done => {
    const update = {summary: 'Do that more important thing'};
    request
      .put(`${actionPath}/${testAction._id}`)
      .set('Authorization', token)
      .send(update)
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body.summary, 'Do that more important thing');
        done();
      })
      .catch(done);
  });

  it('archives an action item', done => {
    const update = {completed: true};
    request
      .put(`${actionPath}/completed/${testAction._id}`)
      .set('Authorization', token)
      .send(update)
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body.completed, true);
        done();
      })
      .catch(done);
  });

});
