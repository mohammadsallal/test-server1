const express = require('express');
const mysql = require('mysql');
const app = express()


const con =  mysql.createConnection({
host:'185.27.134.215',
user:'if0_35109126',
password:'jyyWj8D6emyxc',
database:'if0_35109126_Testdb'
})
con.connect((err)=>{
   if(err)throw err;
    console.log('Connected with mySql')
})


app.listen(3000 , ()=>{
    console.log('Server started on port 3000')
})