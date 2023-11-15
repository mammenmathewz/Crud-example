const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

router.get('/', (req, res) => {
  if (req.session.user) {
     return res.render('adminhome');
  }
  res.render('adminlogin')
});



// router.get('/home',(req, res) => {
//     res.render('./admin/adminhome')
//  }); 

 router.post('/adminhome', (req, res) => {
   if (req.body.email === "admin@gmail.com" && req.body.password === "12345") {
    req.session.user=req.body.email
    res.render('adminhome');
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
    res.render('adduser')
 })

module.exports=router