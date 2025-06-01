const sql = require('mssql');
require('dotenv').config();

console.log("🔍 Checking environment variables:");
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_SERVER:", process.env.DB_SERVER);
console.log("DB_DATABASE:", process.env.DB_DATABASE);

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const poolpromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("MSSQL Connected");
        return pool;
    })
    .catch(err => {
        console.error("DB connection failed", err);
        throw err;
    });

module.exports = {
    sql,
    poolpromise
};