const express = require('express')
const router = express.Router()
const User = require('../models/users')
const session = require('express-session')

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Middleware for checking if a user is authenticated
function checkAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
}

router.get('/',(req,res)=>{
  if (req.session.user) {
    return res.redirect('/home');
  }
  res.render("login");
})

router.get('/signup',(req,res)=>{
    res.render('signup_page')
})

router.get('/home', checkAuthenticated, (req, res) => {
  res.render('home', { name: req.session.user.name });
});



router.post('/signup', async (req, res) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
      return res.render('signup_page',{ message: 'User already exists', type: 'danger' });
  }

  // If user does not exist, proceed with signup
  const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password
  });
  try {
      await newUser.save();
      req.session.message = 'Signup successfully completed';
      res.redirect('/');
  } catch (err) {
      res.json({ message: err.message, type: 'danger' });
  }
});


// In your router file
router.post('/login', async (req, res) => {
  // Find user by email
  const user = await User.findOne({ email: req.body.email });
  const { email, password } = req.body;

  if (!user) {
      return res.render('login',{message:"Invalid email-id", type: 'danger'});
  }

  // Validate password
  if (password !== user.password) {
    return res.render('login',{message:"Invalid password", type: 'danger'});
  }

  // Set user session
  req.session.user = user;

  // Redirect to home
res.redirect('/home');

});



router.get('/logout', (req, res) => {
  if (req.session.user) {
    req.session.user = null;
    res.redirect('/');
  } else {
    res.redirect('/error');
  }
})
module.exports=router