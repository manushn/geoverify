const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { poolpromise, sql } = require('../database/mssqldb');

router.post('/register', async (req, res) => {
    const { Username, Password, Name } = req.body;

    if (!Username || !Password || !Name) {
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
            .input('Username', sql.VarChar, Username)
            .input('HPassword', sql.VarChar, hashedPassword)
            .input('Name', sql.VarChar, Name)
            .query("INSERT INTO Users (username, password, name) VALUES (@Username, @HPassword, @Name)");

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ message: "Registration API Error" });
    }
});

router.post('/login', async (req, res) => {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const pool = await poolpromise;

        const result = await pool.request()
            .input('Username', sql.VarChar, Username)
            .query("SELECT * FROM Users WHERE username = @Username");

        const user = result.recordset[0];

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(Password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        return res.status(200).json({
            message: "Login successful",
            Username: user.username,
            Name: user.name,
            success: true
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Login API Error" });
    }
});

module.exports = router;