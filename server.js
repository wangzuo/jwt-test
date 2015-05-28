var express = require('express');
var expressJwt = require('express-jwt');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var _secret = 'hello world!';

var app = express();
app.use(bodyParser.json());
app.use('/api', expressJwt({secret: _secret}));

app.post('/auth', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  if(email !== 'wangzuo@example.com' || password !== '123') {
    return res.status(401).send('Wrong email or password');
  }

  var user = {
    name: 'wang zuo',
    email: 'wangzuo@example.com',
    id: 123,
    avatar: 'test.jpg'
  };

  var token = jwt.sign(user, _secret, {expiresInMinutes: 60*5});
  res.send({token: token});
});

app.get('/api/restricted', function(req, res, next) {
  res.send({name: req.user.name});
});

app.use(function(err, req, res, next) {
  if(err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});

app.listen(1234, function() {
  'server listening on 1234'
});

module.exports = app;
