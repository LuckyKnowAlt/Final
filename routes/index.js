const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
router.get('/register', (req, res) => res.render('register'));
router.post('/register', (req, res) => 
    {
      const { username, password, firstName, lastName, age, gender } = req.body;
      User.findOne({ username }).then(user => 
    {
    if (user) 
    {
      req.flash('error_msg', 'Taken');
      res.redirect('/register');
    } 
    else {
      const secret = speakeasy.generateSecret();
      const newUser = new User({
        username,
        password,
        firstName,
        lastName,
        age,
        gender,
        twoFactorSecret: secret.base32,
        twoFactorAuth: true
      });
      bcrypt.genSalt(10, (err, salt) => 
      {
        bcrypt.hash(newUser.password, salt, (err, hash) => 
         {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then(user => 
           {
            req.flash('success_msg', 'Please set up 2FA.');
            res.redirect('/login');
            const mailOptions = 
	    {
              from: process.env.EMAIL_USER,
              to: user.username,
              subject: 'Portfolio',
              text: 'Please set up 2FA.'
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error('Error sending email: ', error);
              }
            });
          }).catch(err => console.error(err));
        });
      });
    }
  });
});
router.get('/login', (req, res) => res.render('login'));
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/portfolio',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success_msg', 'Logged out');
    res.redirect('/login');
  });
});
router.get('/2fa/setup', (req, res) => {
  const secret = speakeasy.generateSecret();
  qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    res.render('2fa-setup', { qrcode: data_url, secret: secret.base32 });
  });
});
router.post('/2fa/verify', (req, res) => {
  const { token } = req.body;
  const verified = speakeasy.totp.verify({
    secret: req.user.twoFactorSecret,
    encoding: 'base32',
    token: token
  });
  if (verified) {
    req.flash('success_msg', '2FA complete!');
    res.redirect('/portfolio');
  } else {
    req.flash('error_msg', 'Invalid token');
    res.redirect('/2fa/setup');
  }
});
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success_msg', 'logged out');
    res.redirect('/login');
  });
});

module.exports = router;
