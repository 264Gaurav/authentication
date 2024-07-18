const mongoose=require('mongoose');

const User=new mongoose.Schema({
          name: {
            type:String,
            required: true,
          },
          phone : {
            type:Number
          },
          email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase:true
          },
          userType:{
            type:String,
            enum:['admin', 'user'] ,//admin or user only
            default:'user'
          },
          password: {
            type: String,
            required: true,
          }
} , { timestamps: true }) //timestamp will add createAt and updatedAt time automatically to the instances



module.exports=mongoose.model('User', User);