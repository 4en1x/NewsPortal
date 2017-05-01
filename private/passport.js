const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('diskdb');

db.connect('public/JSON', ['users']);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
passport.use(new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      const user = db.users.findOne({ firstName: username });
      if (!user) {
        return done(null, false, { message: 'wrong user' });
      }
      if (password !== user.lastName) {
        return done(null, false, { message: 'wrong password.' });
      }
      user.sessionID = req.sessionID;
      return done(null, user);
    })
);

module.exports = passport;
