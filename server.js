// all depencies and inbuilt library
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')
const cyptoRoutes  = require('./router/authenticationRoute')
const mongoose = require('mongoose');



// all variable
const app = express();
const AuthURI= "mongodb+srv://sachinyadav:hhLSFuQifzTN2vfi@cryptodata-cluster.k3k13nu.mongodb.net/CryptoData?retryWrites=true&w=majority";

app.use(bodyParser.json())


app.use(cors({
    origin:true,
    credentials:true
    
}));
app.use(logger('dev'));

app.use('/api',cyptoRoutes)

mongoose.connect(AuthURI);
mongoose.connection.once('open',()=>{
    console.log('connected');
}).on('error',(err)=>{
    console.log(err);
})

const port = process.env.PORT||8000;
app.listen(port,(err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('server is running on port ')

})