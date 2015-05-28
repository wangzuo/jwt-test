var assert = require('assert');
var app = require('./server');
var request = require('supertest');

describe('auth', function() {
  it('fail', function(done) {
    request(app)
      .post('/auth')
      .send({
        email: 'wangzuo@example.com',
        password: 'wrong'
      })
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('succeed with token', function(done) {
    request(app)
      .post('/auth')
      .send({
        email: 'wangzuo@example.com',
        password: '123'
      })
      .set('Accept', 'application/json')
      .expect(function(res) {
        if(!res.body.token) throw new Error('missing token');
      })
      .expect(200, done);
  });

  it('protected failure', function(done) {
    request(app)
      .get('/api/restricted')
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('protected success', function(done) {
    request(app)
      .post('/auth')
      .send({
        email: 'wangzuo@example.com',
        password: '123'
      })
      .end(function(err, res) {
        var token = res.body.token;
        request(app)
          .get('/api/restricted')
          .set('Authorization', 'Bearer '+token)
          .expect(200, done);
      });
  });
});
