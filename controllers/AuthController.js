const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const user = require('../models/usermodel');

router.use(bodyparser.urlencoded({extended:true}));
router.use(bodyparser.json());

//get all users
router.get('/users',(req,res)=>{
    user.find({},(err,data) =>{
        if(err) throw err;
        res.send(data)
    })
})

//register user
router.post('/register',(req,res)=>{
    user.find({email:req.body.email},(err,data)=>{
        if(data.length > 0){   
           res.send("This email is already taken");
        }
        else{
               //encrypt password
               let hashpassword = bcrypt.hashSync(req.body.password,8);
               user.create({
               name:req.body.name,
               email:req.body.email,
               password:hashpassword,
               phone:req.body.phone,
               address:req.body.address,
               role:req.body.role ? req.body.role : 'user'
              },(err,data) =>{
             if(err) return res.send("error while register");
             res.send('register successful')
            }
          )
        } 
      }
    )
}
)
       
//LOGIN
router.post('/login',(req,res)=>{
    user.findOne({email:req.body.email},(err,user)=>{
        if(err){
            res.send({auth:false,token:"error while logging"});
        }
        else if(!user){
            res.send({auth:false,token:"no user found"});
        }
        else{
            const passIsValid = bcrypt.compareSync(req.body.password,user.password);
            if(!passIsValid ){
                res.send({auth:false,token:"password is incorrect"});
            }
            //In case both valid
            else{
                let token = jwt.sign({id:user._id},config.secret,{expiresIn:86400}) //24 hours
                res.send({auth:true,token:token});
            }
        }
    })
})

//get Userinfo 
router.get('/userinfo',(req,res)=>{
    let token = req.headers['x-access-token'];
    if(!token){
        res.send({auth:false,token:"no token provided"});
    }
    //jwt verify
    else {
        jwt.verify(token,config.secret,(err,oneuser)=>{
            if(err){
                res.send({auth:false,token:"invalid token"});

            }
            else{
                user.findById(oneuser.id,(err,result)=>{
                    res.send(result);
                })
            }
        })

    }
})
module.exports = router;
