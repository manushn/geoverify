const express = require("express");
require('dotenv').config();
const cors = require('cors');
const { poolpromise } = require("./database/mssqldb");
const Login = require("./routes/login");

const app = express();
app.use(cors());
app.use(express.json());

async function initialCheck() {
    try {
        const pool = await poolpromise;
        await pool.request().query(`
            IF NOT EXISTS (
                SELECT * FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_NAME = 'Users' AND TABLE_SCHEMA = 'dbo'
            )
            BEGIN
                CREATE TABLE Users (
                    ID INT PRIMARY KEY IDENTITY(1,1),
                    username NVARCHAR(100) NOT NULL,
                    password NVARCHAR(100) NOT NULL,
                    name NVARCHAR(200) NOT NULL,
                    role VarChar(7) NOT NULL,
                    allowed_district VARCHAR(200) NOT NULL

                );
            END
        `);
        console.log("Users table checked/created");
    } catch (err) {
        console.error("Error creating/checking Users table:", err);
    }
}

app.use('/', Login);

app.get('/', (req, res) => {
    res.send("Hello from Express server");
});

initialCheck();

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running at port ${process.env.PORT || 4000}`);
});