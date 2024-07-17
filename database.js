const mongoose=require('mongoose');
const MONGO_URL=process.env.MONGO_URL;

const database= mongoose.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})


database.then(()=>{
    console.log('MongoDB connected successfully');
}).catch((err)=>{
    console.error('Error connecting to MongoDB', err);
})


module.exports=database;