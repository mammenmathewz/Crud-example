const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');
const User = require('../models/users');
const session = require('express-session');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())


router.get('/', (req, res) => {
  if (req.session.user) {
     return res.render('adminhome');
  }
  res.render('adminlogin')
});

router.get('/adminhome', async (req, res) => {
  if (req.session.user) {
    try {
      let users = await User.find({}); // Fetch all users from the database
      if (!users) users = []; // If users is undefined, set it to an empty array
      res.render('adminhome', { users: users }); // Pass the users to the view
    } catch (err) {
      console.error(err);
      res.send('Error occurred while fetching data');
    }
  }else{
    res.redirect('/admin');
  }
  });


router.post('/adminhome', async (req, res) => {
  if (req.body.email === "admin@gmail.com" && req.body.password === "12345") {
   req.session.user=req.body.email
   let users = await User.find({});
   res.render('adminhome', { users: users });
    console.log(req.body);
  } else {
    res.redirect('adminlogin');
  }
});


 router.get('/logoutadmin', (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      res.render('error',{title: "404"})
    } else {
      res.render('adminlogin')
    }
  })
})




router.get('/newuser',(req,res)=>{
    res.render('adduser',)
 })

 router.post('/add', async (req, res) => {
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
      return res.status(404).send('User not found');
    }
    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.password = req.body.password;

    await user.save();
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
    res.redirect('/admin/adminhome');
  } catch (err) {
    console.error(err);
    res.send('Error occurred while deleting user');
  }
});

router.get('/search', async (req, res) => {
  let q = req.query.q;
  if (!q) {
    return res.status(400).send('Search term is required');
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