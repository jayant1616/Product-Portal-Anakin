const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
const { sequelize } = require('../models/models');
const Db = require('../models/models');

const jwtHeader = 'jwt-token-x'

const checkAuthentication = async (req,res,next)=>{
    let token = req.headers[jwtHeader];
    if(!token){
        return res.status(403).json({message:'Missing authentication header, not authorised'});
    }
    // token = token.split(' ')[1];

    let decodedToken = false;

    try{
        decodedToken = jwt.verify(token,"secretKey");
        console.log(decodedToken);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:'internal server error'});
    }

    if(!decodedToken){
        return res.status(403).json({message:'invalid token, not authorised'});
    }

    console.log("decoded token is",decodedToken);
    const product = await Db.Product.findOne({
        where : {
            id : req.params.productId
        }
    });
    if(product.BrandId != decodedToken.brandId){
        console.log(product.BrandId,decodedToken.brandId);
        return res.status(403).json({message: `not authorised to make changes for product Id : ${req.params.productId}`});
    }

    next();
}

module.exports = checkAuthentication;