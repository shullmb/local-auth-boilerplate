const express = require('express');
const passport = require('../config/passportConfig');
const db = require('../models');
const router = express.Router();

// GET /auth/signup - sends form for signup
router.get('/signup', (req,res) => {
  res.render('auth/signup');
})

// GET /auth/login - sends form for login
router.get('/login', (req,res) => {
  res.render('auth/login');
})

// POST /auth/signup - process signup form
router.post('/signup', (req,res) => {
  // looks up user in db 
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread( (user,created) => {
    if (created) {
      // No record found, so one was created
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logged in!'
      })(req,res); // <= IIFE == immediately invoked function expression
    } else {
      // existing record found - diff email required
      req.flash('error', 'Email already exists!')
      res.redirect('/auth/signup');
    }
  }).catch( (error) => {
    // catch any additional errors
    console.log(error.message);
    req.flash('error', error.message)
    res.redirect('/auth/signup');
  })
})

// POST /auth/login - process login form
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  successFlash: 'You have logged in!',
  failureFlash: 'Invalid username and/or password!'
}))

// GET /auth/logout - process logout
router.get('/logout', (req,res) => {
  // Passport logout() removes req.user and clears a session
  req.logout();
  req.flash('success', 'you have logged out!');
  res.redirect('/');
})

module.exports = router;
