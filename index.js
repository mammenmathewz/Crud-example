require("dotenv").config()
const express = require('express')
const session = require('express-session')
const cookiePaser = require('cookie-parser')
const mongoose = require('mongoose')
const adminRoutes = require('./routes/admin');


const app = express()
const PORT = process.env.PORT || 5005
 

//db connection//
 mongoose.connect(process.env.DB_URI,)
 const db=mongoose.connection
 db.on("error",(error)=>{console.log("ERROR")})
 db.once("open",()=>{console.log("CONNECTED TO DATA_BASE")})

 
 //middlewares//
 app.use(express.json())
 app.use(express.urlencoded({extended:true}))


app.use(cookiePaser())
 app.use(session(
    {
        secret:"secret key",
        saveUninitialized:true,
        resave:false,
        cookie:{
         maxAge:24 * 60 * 60 * 1000 
        }
    }
 ))

 app.use('/admin',session(
   {
       secret:"secret key",
       saveUninitialized:true,
       resave:false,
       cookie:{
        maxAge:24 * 60 * 60 * 1000 
       }
   }
))



 app.use((req,res,next)=>{
    res.locals.message=req.session.message
    delete req.session.message;
    next()
 })
// template engine//

 app.set('view engine','ejs')



app.use('/admin', adminRoutes);
app.use('/', require("./routes/login"));
app.use('/signup', require("./routes/login"));
app.use('/home', require('./routes/login'));

app.use('*', (req, res) => {
   res.status(404).send(`
    <html>
      <body style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: black;">
        <h1 style="color: red; text-align: center;">
          404 Not Found
        </h1>
        <a href="javascript:history.back()" style="display: block; color: white; text-align: center; padding:5px">Go Back</a>
      </body>
    </html>
   `);
});


app.use(function(err, req, res, next) {
   console.error(err.stack); // This will print the stack trace of the error
   res.status(500).send('Something broke!');
 });


app.listen(PORT, (error) => {
   if (error) throw error;
   console.log(`Server is running on http://localhost:${PORT}`);
 });
 