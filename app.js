const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const SessionStore = require('connect-diskdb')(expressSession);

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const options = {
  path: `${__dirname}/public/JSON`,
  name: 'sessions',
};
const diskDBSessionStore = new SessionStore(options);

app.use(expressSession({
  name: 'login',
  secret: 'UFOSecret',
  resave: false,
  saveUninitialized: false,
  store: diskDBSessionStore,
}));

const passport = require('./private/passport.js');

app.use(passport.initialize());
app.use(passport.session({}));

app.use('/', require('./private/router.js'));

app.listen(process.env.PORT || 5000);
