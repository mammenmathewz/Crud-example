const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
   res.render('./admin/adminlogin')
});
router.get('/home', (req, res) => {
    res.render('./admin/adminhome')
 });
 
 router.get('/newuser',(req,res)=>{
    res.render('./admin/adduser')
 })

module.exports=router