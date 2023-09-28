const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'mohammad'
const app = express()

app.use(bodyParser.json());
app.use(cors());

const con =  mysql.createConnection({
host:'localhost',
user:'root',
password:'2468',
port:3306,
database:'schoolm'
})
con.connect((err)=>{
    if(err){
        return;
    }
    console.log('Connected with mySql')
})

function hashing(password){
    return new Promise((resolve , reject)=>{
        bcrypt.hash(password , 10 , (err , hashed)=>{
            if(err){
                reject(err)
            }
            resolve(hashed)
        })
    })
}
app.post('/regiser', async(req , res)=>{
    const {username , firstname , lastname , password} = req.body;
    const hashedPass = await hashing(password);
    con.query(`select * from users where username = ?`,[username],(err , result)=>{
        if(err)throw err;
        if(result.length == 0){
            con.query(`INSERT INTO users (username , firstname , lastname , password) values(? , ? , ? , ?)`,
            [username ,firstname,lastname, hashedPass ] , (err)=>{
            if(err) throw err;
            res.status(200).send('Register user successfuly')
         })
        }else{
            res.status(300).send('User already exist')
        }
    })

})



app.post('/login',(req , res)=>{
    const {username , password} = req.body;
    const token =  jwt.sign({username , password} , secretKey , {expiresIn:'20s'} )
    con.query(`select * from users where username = ?`,[username],(err , result)=>{
        const data = result;
        if(result.length == 0){
            res.status(400).send('User Not found')
        }else{

            bcrypt.compare(password , result[0].password , (err , result)=>{
                if(err){
                    res.status(500).send('Server Error')
                }
                 if(result){
                    res.status(200).send({
                        message:'Logging successfuly',
                        firstname:data[0].firstname,
                        lastname:data[0].lastname,
                        token
                    })
                }else{
                    res.status(403).send( 'Uncorrect Password')
                }
            })
        }
    })
})

function checkToken(req , res , next){
    const BearerToken = req.headers.authorization;
    const token = BearerToken.replace('Bearer ' , "")
    jwt.verify(token , secretKey , (err , decoded)=>{
        if(err){
            res.status(401).send('Unauthorized')
        }
        if(decoded){
            next()
        }else{
            res.status(403).send('Forbidden')
        }
    })
}

app.get('/getUser',checkToken,(req , res)=>{
    res.send('hello')
})
app.listen(3000 , ()=>{
    console.log('Server started on port 3000')
})