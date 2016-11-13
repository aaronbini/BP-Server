const request = require('../request');
const assert = require('chai').assert;
const authPath = '/api/auth';
const readingPath = '/api/readings';
const actionPath = '/api/actionItems';

describe('user auth routes', () => {

  describe('unauthorized requests', () => {
    it('errors on request with no token', done => {
      request
        .get(readingPath)
        .then(() => {
          done('should not have gotten in then block');
        })
        .catch(err => {
          assert.equal(err.response.status, 403);
          assert.equal(err.response.body.message, 'Authorization failed, token missing.');
          done();
        })
        .catch(done);
    });

    it('errors with an invalid token', done => {
      request
        .get(readingPath)
        .set('Authorization', 'Bearer badtoken')
        .then(() => {
          done('should not have gotten in then block');
        })
        .catch(err => {
          assert.equal(err.response.status, 403);
          assert.equal(err.response.body.message, 'Authorization failed, token invalid.');
          done();
        })
        .catch(done);
    });

  });

  describe('user management', () => {

    const testUser = {username: 'test', password: 'testpass', email: 'test@gmail.com'};
    //eslint-disable-next-line no-unused-vars
    let token = '';

    function badRequest(url, toSend, error, cb) {
      request
        .post(url)
        .send(toSend)
        .then(
          () => {cb('status should not be 200');},
          err => {
            assert.equal(err.status, 400);
            assert.equal(err.response.body.message, error);
            cb();
          }
        ).catch(cb);
    }

    it('signup errors when no username is provided', done => {
      badRequest(`${authPath}/signup`, {email: 'testtest@gmail.com', password: 'test'}, 'All fields are required.', done);
    });

    it('signup errors when no password is provided', done => {
      badRequest(`${authPath}/signup`, {username: 'Aaron', email: 'aaron@gmail.com'}, 'All fields are required.', done);
    });

    it('signup errors when no email is provided', done => {
      badRequest(`${authPath}/signup`, {username: 'Jeremy', password: 'testpass'}, 'All fields are required.', done);
    });

    it('signs up valid user', done => {
      request
        .post(`${authPath}/signup`)
        .send(testUser)
        .then(res => {
          assert.equal(res.status, 200);
          assert.ok(token = res.body.token.token);
          done();
        })
        .catch(done);
    });

    it('errors on bad url', done => {
      request
        .get('/api/notFound')
        .set('Authorization', token)
        .then(() => {
          done('should be an error here');
        })
        .catch(err => {
          assert.equal(err.status, 404);
          assert.deepEqual(err.response.body, {error: 'GET /api/notFound does not exist'});
          done();
        })
        .catch(done);
    });

    it('errors on unsupported http verb', done => {
      request
        .patch('/api/readings')
        .set('Authorization', token)
        .then(() => {
          done('should be an error here');
        })
        .catch(err => {
          assert.equal(err.status, 405);
          assert.deepEqual(err.response.body, {error: 'That action is not supported here.'});
          done();
        })
        .catch(done);
    });

    it('cannot use the same email as an existing user', done => {
      request
        .post(`${authPath}/signup`)
        .send(testUser)
        .then(() => {
          done('should not be status 200');
        })
        .catch(err => {
          assert.equal(err.status, 500);
          assert.equal(err.response.body.message, 'That email is already in use.');
          done();
        })
        .catch(done);
    });

    it('can access ensureAuth protected routes after valid signup', done => {
      request
        .get(`${actionPath}`)
        .set('Authorization', token)
        .then(res => {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, 1);
          done();
        })
        .catch(done);
    });

    it('signs in valid user', done => {
      request
        .post(`${authPath}/signin`)
        .send(testUser)
        .then(res => {
          assert.equal(res.status, 200);
          assert.ok(res.body.token.token);
          done();
        })
        .catch(done);
    });

    it('properly checks for valid token', done => {
      request
        .get(`${authPath}/verify`)
        .set('Authorization', token)
        .then(res => {
          assert.equal(res.status, 200);
          assert.equal(res.body.success, true);
          done();
        })
        .catch(done);
    });

  });

});
