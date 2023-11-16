const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    created:{
        type:Date,
        required:true,
        default:Date.now
    }

})
userSchema.index({ name: 'text', email: 'text', phone: 'text' });


module.exports=mongoose.model("user",userSchema)