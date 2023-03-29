const Db = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerController = async (req,res)=>{
    const {brandname, username, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password,10);

    //check if username is in use:
    let userExists;
    try{
        userExists = await Db.User.findOne({
            where : {
                username : username,
            }
        })
    }
    catch(err){
        console.log("error in registering new user", err);
        res.status(500).json({message:"internal server error"});
    }

    console.log("user to be registered is ", userExists);
    if(userExists){
        return res.status(401).json({message:'username already in use'})
    }

    let user, brand;
    
    try{
            user = await Db.User.create({
            username : username,
            password:hashedPassword,
        });
            brand = await Db.Brand.create({
            name : brandname,
            UserId : user.id,
        });
        Db.User.update({
            BrandId : brand.id
        },{
            where:{
                id : user.id
            }
        });
    }
    catch(err){
        console.log("Database error in creating new user or brand");
        res.status(500).json({message:"internal server error"});
    }


    const token = jwt.sign({userId:user.id,brandId:brand.id},'secretKey');
    res.status(201).json({
        username : user.username,
        token:token,
        brandId:brand.id
    });
}

const loginController = async (req,res)=>{
    const {username,password} = req.body;
    const user = await Db.User.findOne({
        where:{
            username : username
        }
    })
    if(!user){
        return res.status(401).json({message:'Invalid username'});
    }
    
    const passwordMatches = await bcrypt.compare(password,user.password);
    if(!passwordMatches){
        return res.status(401).json({message:'Incorrct pasword'});
    }
    const token = jwt.sign({userId:user.id,brandId:user.BrandId},'secretKey');
    res.json({message:'login successful',token:token,brandId : user.BrandId});
} 

module.exports = {
    "registerControlller" : registerController,
    "loginController" : loginController
}