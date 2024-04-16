const express = require('express');
const mysql = require('mysql');
const connection = require('./dbConnection')

const app = express();

connection.connect

app.use('/',(req,res)=>{
    res.send("hello server")
})

const PORT = process.env.PORT || 4001

app.listen(PORT, ()=>{
    console.log(`server is running at ${PORT}`)
})