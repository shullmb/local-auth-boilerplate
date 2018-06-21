const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

// This turns the user into just an id for serialization
passport.serializeUser( (user, cb) => {
  cb(null, user.id);
})

// this looks up user in db with id
passport.deserializeUser( (id, cb) => {
  db.user.findById(id).then( (user) => {
    cb(null, user);
  }).catch(cb);
})

// define Local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, cb) => {
  db.user.find({
    where: {email: email}
  }).then( (user) => {
    if (!user || !user.validPassword(password)) {
      cb(null, false);
    } else {
      cb(null, user);
    }
  }).catch(cb);
}))

module.exports = passport;