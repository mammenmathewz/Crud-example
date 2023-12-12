const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');
const User = require('../models/users');
const session = require('express-session');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

router.get('/',async (req, res) => {
  if (req.session.admin) {
    let users = await User.find({});
     return res.render('adminhome',{ users: users });
  }
  res.render('adminlogin')
});


router.get('/adminhome', async (req, res) => {
  if (req.session.admin) {
    try {
      let users = await User.find({});
      res.render('adminhome', { users: users });
    } catch (err) {
      console.error(err);
      res.send('Error occurred while fetching data');
    }
  } else {
    res.redirect('/admin');
  }
});



  router.post('/adminhome', async (req, res) => {
    if (req.body.email === "admin@gmail.com" && req.body.password === "12345") {
      req.session.admin = req.body.email;
      // Redirect to '/adminhome' instead of rendering the view
      res.redirect('/admin/adminhome');
    } else {
      res.render('adminlogin', { message: "Invalid email-id or password", type: 'danger' });
    }
  });
  


  router.get('/logoutadmin', (req, res) => {
    if (req.session.admin) {
      req.session.admin = null;
      res.render('adminlogin', {message: "Logout successfully", type: 'success'});
    } else {
      res.render('error', {title: "404"});
    }
  })


router.get('/newuser',(req,res)=>{
    res.render('adduser',)
 })

 router.post('/add', async (req, res) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
      return res.render('adduser',{ message: 'User already exists', type: 'danger' });
  }

  const newUser = new User({ // Changed 'user' to 'User'
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password
  });
  try {
      await newUser.save();
      req.session.message = 'User successfully added';
      res.redirect('adminhome');
  } catch (err) {
      res.json({message: err.message, type: 'danger'});
  }
});


//update//

router.get('/edit/:id', async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('edituser', { user: user });
  } catch (err) {
    console.error(err);
    res.send('Error occurred while fetching user data');
  }
});


router.post('/edit/:id', async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.render('edituser',{message:'User not found'});
    }
    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.password = req.body.password;

    await user.save();
    req.session.message = 'User successfully updated';
    res.redirect('/admin/adminhome');
  } catch (err) {
    console.error(err);
    res.send('Error occurred while updating user data');
  }
});


router.get('/delete/:id', async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    await user.deleteOne();
    req.session.message = 'User successfully removed';

    res.redirect('/admin/adminhome');
  } catch (err) {
    console.error(err);
    res.send('Error occurred while deleting user');
  }
});

router.get('/search', async (req, res) => {
  let q = req.query.q;
  if (!q) {
    return res.render('adminhome', { error: 'Search ' });
  }
  try {
    let users = await User.find({ $text: { $search: q } });
    res.render('adminhome', { users: users });
  } catch (err) {
    console.error(err);
    res.send('Error occurred while searching users');
  }
});



module.exports=router