const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel').User;

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
passport.use(new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      User.findOne({ username }).then(
          (user) => {
            if (!user) {
              return done(null, false, { message: 'wrong user' });
            }
            if (password !== user.password) {
              return done(null, false, { message: 'wrong password.' });
            }
            user.sessionID = req.sessionID;
            return done(null, user);
          }
      );
    })
);

module.exports = passport;
