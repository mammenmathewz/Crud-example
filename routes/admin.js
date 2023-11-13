const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())


router.get('/', (req, res) => {
   res.render('./admin/adminlogin')
});


// router.get('/home',(req, res) => {
//     res.render('./admin/adminhome')
//  }); 

 router.post('/adminhome', (req, res) => {
   if (req.body.email === "admin@gmail.com" && req.body.password === "12345") {
     res.render('./admin/adminhome');
     console.log(req.body);
   } else {
     res.redirect('/admin/adminlogin');
   }
 });
 


 



router.get('/newuser',(req,res)=>{
    res.render('./admin/adduser')
 })

module.exports=router