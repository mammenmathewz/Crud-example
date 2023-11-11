
const express = require('express')
const router = express.Router()
const User = require('../models/users') // Changed 'user' to 'User'
const users = require('../models/users')
const session = require('express-session')

router.get('/',(req,res)=>{
  if (req.session.user) {
    return res.redirect('home');
  }
  res.render("login");
})


router.get('/signup',(req,res)=>{
    res.render('signup_page')
 })
router.get('/home',(req,res)=>{
    res.render('home')
    
})

router.post('/signup', async (req, res) => {
    const newUser = new User({ // Changed 'user' to 'User'
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password
    });
    try {
        await newUser.save();
        res.redirect('/');
    } catch (err) {
        res.json({message: err.message, type: 'danger'});
    }
});


// In your router file
router.post('/login', async (req, res) => {
  // Find user by email
  const user = await User.findOne({ email: req.body.email });
  const { email, password } = req.body;

  if (!user) {
      return res.status(400).send('Email is not found');
  }

  // Validate password
  if (password !== user.password) {
      return res.status(400).send('Invalid password');
  }

  // Set user session
  req.session.user = user;

  // Redirect to home
  res.redirect('/home');
});




router.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      res.render('error',{title: "404"})
    } else {
      res.render('login')
    }
  })
})


module.exports=router