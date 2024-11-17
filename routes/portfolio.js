const speakeasy = require('speakeasy');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { ensureAuthenticated } = require('../config/auth');
const PortfolioItem = require('../models/PortfolioItem');
const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
router.get('/', ensureAuthenticated, (req, res) => {
  PortfolioItem.find({})
    .then(items => {
      res.render('portfolio', { user: req.user, items });
    })
    .catch(err => {
      console.error('Error fetching portfolio:', err);
      res.status(500).send('Server Error');
    });
});
router.get('/create', ensureAuthenticated, (req, res) => {
  if (req.user.twoFactorAuth && !req.session.twoFactorVerified) {
    req.flash('error_msg', 'Two-factor required.');
    return res.redirect('/2fa/verify');
  }
  if (req.user.role !== 'admin') {
    req.flash('error_msg', 'Unauthorized');
    return res.redirect('/portfolio');
  }
  res.render('create-portfolio');
});
router.post('/create', ensureAuthenticated, upload.array('images', 3), (req, res) => {
  try {
    if (req.user.twoFactorAuth && !req.session.twoFactorVerified) {
      req.flash('error_msg', 'Two-factor required.');
      return res.redirect('/2fa/verify');
    }
    if (req.user.role !== 'admin') {
      req.flash('error_msg', 'Unauthorized');
      return res.redirect('/portfolio');
    const { title, description } = req.body;
    if (!title || !description) {
      req.flash('error_msg', 'Required');
      return res.redirect('/portfolio/create');
    }
    if (req.files.length !== 3) {
      req.flash('error_msg', '3 images.');
      return res.redirect('/portfolio/create');
    }
    const images = req.files.map(file => file.path);
    const newPortfolioItem = new PortfolioItem({
      title,
      description,
      images,
      createdBy: req.user.id
    });
    newPortfolioItem.save()
      .then(() => {
        req.flash('success_msg', 'Create success');
        res.redirect('/portfolio');
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: req.user.username,
          subject: 'Portfolio Item Created',
          text: `Portfolio item "${title}" successfully created.`
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error email:', error);
          }
        });
      })
      .catch(err => {
        console.error('Error database:', err);
        req.flash('error_msg', 'Try again.');
        res.redirect('/portfolio/create');
      });
  } catch (err) {
    console.error('Unexpected error:', err);
    req.flash('error_msg', 'Try again.');
    res.redirect('/portfolio/create');
  }
});
router.post('/edit/:id', ensureAuthenticated, (req, res) => {
  if (req.user.twoFactorAuth && !req.session.twoFactorVerified) {
    req.flash('error_msg', 'Two-factor required.');
    return res.redirect('/2fa/verify');
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    req.flash('error_msg', 'Invalid ID format');
    return res.redirect('/portfolio');
  }
  if (req.user.role !== 'admin') {
    req.flash('error_msg', 'Unauthorized');
    return res.redirect('/portfolio');
  }
  const { title, description } = req.body;
  PortfolioItem.findById(mongoose.Types.ObjectId(req.params.id))
    .then(item => {
      if (!item) {
        req.flash('error_msg', 'Item not found');
        return res.redirect('/portfolio');
      }
      item.title = title;
      item.description = description;
      return item.save();
    })
    .then(() => {
      req.flash('success_msg', 'Update success');
      res.redirect('/portfolio');
    })
    .catch(err => {
      console.error('Error updating portfolio item:', err);
      req.flash('error_msg', 'Error updating portfolio item. Please try again.');
      res.redirect('/portfolio');
    });
});
router.post('/delete/:id', ensureAuthenticated, (req, res) => {
  if (req.user.twoFactorAuth && !req.session.twoFactorVerified) {
    req.flash('error_msg', 'Two-factor required.');
    return res.redirect('/2fa/verify');
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    req.flash('error_msg', 'Invalid ID format');
    return res.redirect('/portfolio');
  }
  if (req.user.role !== 'admin') {
    req.flash('error_msg', 'Unauthorized');
    return res.redirect('/portfolio');
  }
  PortfolioItem.findByIdAndDelete(mongoose.Types.ObjectId(req.params.id))
    .then(item => {
      if (!item) {
        req.flash('error_msg', 'Item not found');
        return res.redirect('/portfolio');
      }
      req.flash('success_msg', 'Delete success');
      res.redirect('/portfolio');
    })
    .catch(err => {
      console.error('Error delete:', err);
      req.flash('error_msg', 'Try again.');
      res.redirect('/portfolio');
    });
});
module.exports = router;
