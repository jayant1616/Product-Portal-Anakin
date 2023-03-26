const Db = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerController = async (req,res)=>{
    const {brandname, username, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password,10);

    //check if username is in use:
    const userExists = await Db.User.findOne({
        where : {
            username : username,
        }
    })
    console.log("user to be registered is ", userExists);
    if(userExists){
        return res.status(401).json({message:'username already exists'})
    }

    const user = await Db.User.create({
        username : username,
        password:hashedPassword,
    });
    const brand = await Db.Brand.create({
        name : brandname,
        UserId : user.id,
    });
    Db.User.update({
        BrandId : brand.id
    },{
        where:{
            id : user.id
        }
    })


    const token = jwt.sign({userId:user.id},'secretKey');
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
    console.log("password is ",user);
    const authorised = await bcrypt.compare(password,user.password);
    if(!authorised){
        return res.status(401).json({message:'Incorrct pasword'});
    }
    const token = jwt.sign({userId:user.id},'secretKey');
    res.json({message:'login successful',token});
} 

module.exports = {
    "registerControlller" : registerController,
    "loginController" : loginController
}