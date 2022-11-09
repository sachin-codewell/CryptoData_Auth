const CryptoUserModel = require('../model/userModel');
const { v4 : uuidv4 } = require('uuid')
const bcrypt  = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET_KEY = "THIS IS MY SECRET KEY FOR JWT"


// FOR REGISTERING NEW USER
function RegisterUser(req,res){
    const newUserInfo = req.body;
    CryptoUserModel.findOne({email:newUserInfo.email},(err,user)=>{
        if(user){
            res.status(404).send('User With Given Email Already Exist');
        }
        else if(!user){
            let newUser = new CryptoUserModel({
                _id:uuidv4(),
                firstname:newUserInfo.firstname,
                lastname:newUserInfo.lastname,
                email:newUserInfo.email,
                phone:newUserInfo.phone,
                password:bcrypt.hashSync(newUserInfo.password,10)
            })
              
            
            newUser.save((err)=>{
                if(!err){
                    res.status(201).send('New UserAdded Successfully');
                }
            })
        }
        else{
            throw err;
        }
    })
}


// TO CHECK USER EXIST IN DATABASE OR NOT
function UserLogin(req,res){
    const existingUser = req.body;
    CryptoUserModel.findOne({email:existingUser.email},(err,user)=>{
        if(user){
            if(bcrypt.compareSync(existingUser.password,user.password)){ 
                console.log(user._id)
                res.status(200).send({token:GenerateToken(user._id)});   
            }
            else{
                res.status(404).send({msg:"Wrong Password"})
            }
            
        }
        else if(!user){
            res.status(404).send({msg:"User With This Email Does Not Exist"});
        }
        else{
            throw err;
        }
    })
}

// GET PROFILE OF A PARTICULAR USER
function GetProfile(req,res){
       let userid =  VerifyToken(req.headers.authorization)
       console.log(userid);
        CryptoUserModel.findOne({_id:userid},(err,user)=>{
            if(user&&!err){
                res.status(200).send(user)
                return;
            }
            else{
                res.status(401).send('Not Authorised')
            }
        })
    
 }


function GenerateToken(userid){
    return jwt.sign(userid,SECRET_KEY);
       
 }

 function VerifyToken(token){
    let userid = jwt.verify(token, SECRET_KEY, (err, decode)=> decode!== undefined?decode:err);
    if(userid instanceof Error){
        return false
    }
    else{
        return userid;
    }
 }

 function VerifyTokenMid(req,res,next){
    if(VerifyToken(req.headers.authorization)){
        res.userid = VerifyToken(req.headers.authorization);
        next();
    }
    else{
        res.status(401).send('No Authorized');
    }

 }
module.exports = { RegisterUser ,UserLogin,GetProfile,VerifyTokenMid }