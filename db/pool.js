const { Pool } = require('pg');
require('dotenv').config();


const connectionString = process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : process.env.DATABASE_PUBLIC_URL;

const config = {
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};



module.exports = new Pool(config);