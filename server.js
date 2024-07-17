const express=require('express');
const bodyParser=require('body-parser');
const dotenv= require('dotenv').config();
const mainRoutes=require('./routes');
const database=require('./database');
const morgan=require('morgan');
const cookieParser = require('cookie-parser'); // Import cookie-parser

const app=express();
app.use(bodyParser.json());
app.use(cookieParser());
const PORT=process.env.PORT || 3222;


app.connect(database);

// Middleware to log HTTP requests
app.use(morgan('dev'));


app.get('/',(req,res)=>{
    res.send('Welcome to Home page'); 
})

app.use('/api/v1' , mainRoutes );








app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})
