const jwt = require('jsonwebtoken');

const checkAuthentication = async (req,res,next)=>{
    let token = req.headers['jwt-token-x'];
    if(!token){
        return res.status(401).json({message:'Missing authentication header, not authorised'});
    }
    // token = token.split(' ')[1];
    console.log(token);
    let decoded_token = false;

    try{
        decoded_token = jwt.verify(token,"secretKey");
        console.log(decoded_token);
    }
    catch(error){
        console.log(error);
    }
    if(!decoded_token){
        return res.status(401).json({message:'invalid token, not authorised'});
    }
    next();
}

module.exports = checkAuthentication;