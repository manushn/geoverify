const jwt=require("jsonwebtoken");
require('dotenv').config();

function tokenverify(req,res,next){
    const authheader=req.header['authorization'];
    console.log("Auth header:",authheader);
    const token=authheader&&authheader.split(' ')[1];

    if(!token){
        return res.status(401).json({emessage:"Json token not provided"});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user=decoded;
        next();
    }catch(err){
        return res.status(403).json({emessage:"Invalid or expaired token"});
    }

}

module.export=tokenverify;