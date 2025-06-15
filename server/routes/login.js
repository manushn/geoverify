const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const axios = require('axios');
const { poolpromise, sql } = require('../database/mssqldb');
const { VarBinary, VarChar } = require('mssql');
const jwt=require("jsonwebtoken")
const Cryptojs=require("crypto-js");

require('dotenv').config();

router.post('/register', async (req, res) => {
    const { Username, Password, Name ,Role,District} = req.body;

    if (!Username || !Password || !Name||!Role||!District) {
        return res.status(400).json({ message: "All fields required" });
    }

    try {
        const pool = await poolpromise;

        const result = await pool.request()
            .input('Username', sql.VarChar, Username)
            .query("SELECT * FROM Users WHERE username = @Username");

        if (result.recordset.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        await pool.request()
            .input('Username', sql.VarChar, Username.trim())
            .input('HPassword', sql.VarChar, hashedPassword.trim())
            .input('Name', sql.VarChar, Name.trim())
            .input('Role',sql.VarChar,Role.trim())
            .input('City',sql.VarChar,District.trim())
            .query("INSERT INTO Users (username, password, name,role,allowed_district) VALUES (@Username, @HPassword, @Name,@Role,@City)");

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ message: "Registration API Error" });
    }
});



router.post('/login', async (req, res) => {
    const { Username, Password ,userLocation} = req.body;

    if (!Username || !Password||!userLocation) {
        return res.status(203).json({ message: "All fields are required" });
    }
    

    
    try {
        const pool = await poolpromise;

        const result = await pool.request()
            .input('Username', sql.VarChar, Username)
            .query("SELECT * FROM Users WHERE username = @Username");

        const user = result.recordset[0];

        if (!user) {
            return res.status(203).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(Password, user.password);
        if (!isMatch) {
            return res.status(203).json({ message: 'Invalid credentials' });
        }

        const apilink=`http://us1.locationiq.com/v1/reverse?key=${process.env.LOCATIONIQ_API}&lat=${userLocation.latitude}&lon=${userLocation.longitude}&format=json`;

        const geores=await axios.get(apilink);
        

        const district=geores.data.address.state_district

        if(!district){
            return res.status(204).json({emessage:"Unable to get location details!"});
        }
        
        if(district.toLowerCase() !==user.allowed_district.toLowerCase()){
            return res.status(203).json({message:"Access denied.You Must be in Limit!"})
        }

        jwtcon={
            Username:user.username,
            Name:user.name,
            role:user.role
        }

        const stoken= jwt.sign(jwtcon,process.env.JWT_SECRET_KEY,{ expiresIn: '30m' })

        const token=Cryptojs.AES.encrypt(stoken,process.env.CRYPTO_ENCRY).toString();

        return res.status(200).json({
            message: "Login successful",
            Username: user.username,
            Name: user.name,
            Role:user.role,
            Success: true,
            Token:token
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Login API Error" });
    }
        
});

module.exports = router;