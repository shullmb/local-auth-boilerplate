require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./config/passportConfig');
const isLoggedIn = require('./middleware/isLoggedIn');
const flash = require('connect-flash');

const app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);

// 1) must come before app.use passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// 2) setup flash messages
app.use(flash());

// 3) must come after session setup
app.use(passport.initialize());
app.use(passport.session());


// 4) Attach flash msg & current user to the response for all routes
app.use( (req,res,next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
})

app.get('/', (req,res) => {
  res.render('index');
})

app.get('/profile', isLoggedIn, (req,res) => {
  res.render('profile');
})

app.use('/auth', require('./controllers/auth'));

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("server running on port 3000");
})

module.exports = server;
