require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
const axios = require('axios');
const multer = require('multer');
const app = express();


require('./config/passport')(passport);


mongoose.connect(process.env.MONGO_URI, 
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected')).catch(err => console.error(err));


app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: true }));


app.use(session
({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());


app.use(flash());


app.use((req, res, next) => 
{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.use(express.static('public'));


app.use('/', require('./routes/index')); // Home, register, login, logout
app.use('/portfolio', require('./routes/portfolio')); // Portfolio CRUD operations
app.use('/api', require('./routes/api')); // API Integrations


const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));