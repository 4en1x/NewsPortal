const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({
  name: 'login',
  secret: 'UFOSecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: 'mongodb://localhost/test',
  }),
}));

const passport = require('./private/passport/passport');

app.use(passport.initialize());
app.use(passport.session({}));

app.use('/', require('./private/router/router'));

app.listen(process.env.PORT || 5000);
