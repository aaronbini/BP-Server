const request = require('./request');
const assert = require('chai').assert;
const signupPath = '/api/auth/signup';
const userPath = '/api/users';
const readingPath = '/api/readings';

describe('reading routes', () => {
  const superUser = {username: 'Jeremy', email: 'jeremy@gmail.com', password: 'pass', role: 'superUser'};
  const testReading = {systolic: 125, diastolic: 68};

  /* eslint-disable no-unused-vars */
  let token = '';
  let userId = '';
  let readingId = '';
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
            //should re-structure tests because they're a bit brittle currently
            //users, readings, etc. created in other test files live on here
            userId = res.body[2]._id;
            done();
          })
          .catch(done);
      });
  });

  it('posts a new reading for a user', done => {
    request
      .post(`${readingPath}/${userId}`)
      .set('Authorization', token)
      .send(testReading)
      .then(res => {
        readingId = res.body._id;
        assert.equal(res.status, 200);
        assert.ok(res.body);
        assert.equal(res.body.systolic, testReading.systolic);
        done();
      })
      .catch(done);
  });

  it('gets all readings if user is superUser', done => {
    request
      .get(`${readingPath}`)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.ok(res.body);
        assert.equal(res.body[0].user, userId);
        done();
      })
      .catch(done);
  });

  it('gets a reading by id as long as reading belongs to requesting user', done => {
    request
      .get(`${readingPath}/${readingId}`)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body.diastolic, testReading.diastolic);
        done();
      })
      .catch(done);
  });

  it('checks and returns true if user has submitted a reading for today', done => {
    request
      .get(`${readingPath}/${userId}/todayCompleted`)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body.todayCompleted, true);
        done();
      })
      .catch(done);
  });

  it('gets readings by user', done => {
    request
      .get(`${readingPath}/byUser/${userId}`)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body.readings[0].systolic, testReading.systolic);
        done();
      })
      .catch(done);
  });

  it('uses a post to query readings by date range', done => {
    const dateRange = {fromDate: '2016-11-05', toDate: '2016-11-14'};
    request
      .post(`${readingPath}/dateRange/${userId}`)
      .send(dateRange)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body.readings[0].diastolic, testReading.diastolic);
        done();
      })
      .catch(done);
  });

  it('properly filters based on date range', done => {
    const dateRange = {fromDate: '2016-11-05', toDate: '2016-11-08'};
    request
      .post(`${readingPath}/dateRange/${userId}`)
      .send(dateRange)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body.readings, []);
        done();
      })
      .catch(done);
  });

  it('updates reading', done => {
    const updatedReading = {systolic: 140};
    request
      .put(`${readingPath}/${readingId}`)
      .send(updatedReading)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body.systolic, updatedReading.systolic);
        done();
      })
      .catch(done);
  });

  it('deletes reading', done => {
    request
      .delete(`${readingPath}/${readingId}`)
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body.systolic, 140);
        assert.equal(res.body.diastolic, 68);
        done();
      })
      .catch(done);
  });

});
