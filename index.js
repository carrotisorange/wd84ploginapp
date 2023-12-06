const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql');
const path = require('path')
const tokens = require('csrf');
const bcrypt = require('bcrypt');
require('dotenv').config();
const app = express()

//database credentials
const db = mysql.createConnection({
    'host': process.env.HOST,
    'user': process.env.user,
    'password': process.env.password,
    'database': process.env.database,
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//session
//configure the session
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
    cookie: {secure:false}
}));


app.get('/signup', (req,res)=>{
    res.render('signup',{ title : 'Sign Up'} );
});

function generateHash(password){
    console.log(password);
     const saltRounds = 10;
        const myPlaintextPassword = password;

        bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
                return hash;
            });
        });
}

app.post('/signup',  [ 
        check('email').notEmpty(),
        check('password').notEmpty()
    ], 
    (req, res)=>{
    
    let email = req.body.email;
    let password = req.body.password;

    let countUser = 'SELECT count(*) AS count FROM users where email =' + mysql.escape(email);

    db.query(countUser, (err, result)=>{
        if(err){
            throw err;
        }else{
            let obj = result[0];
            console.log(obj.count);
            if(parseInt(obj.count) > 0){
                res.render('signup',{title:'Sign Up',errors: 'The email is already taken.' }) 
            }else{
    

                bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                let newRow = {email: email, password: hash}
                let sql = `INSERT INTO users SET?`;

                db.query(sql, newRow, (err, result)=>{
                    if(err){
                        throw err;
                    }else{
                    req.session.user = email;
                    res.redirect('/dashboard');
                    }
                });
                    });
                });


            }
        }
    });

});

app.get('/dashboard', (req,res)=>{
    if(req.session.user){
        res.render('dashboard',{ title : 'Dashboard', user:req.session.user});
    }else{
        res.send(403);
    }
});

app.get('/login', (req, res)=>{
    res.render('login', { title : 'Login'})
});

let credentials = {
    'email': 'user@test.com',
    'password': '1234567'
}
app.post('/authenticate', 
 [ 
    check('email').notEmpty(),
    check('password').notEmpty()
], 
    (req, res)=>{

    let email = req.body.email;
    let password = req.body.password;

    const result = validationResult(req);

    if (result.isEmpty()) {
        req.session.user = email;
        res.redirect('dashboard');
      }else{
        res.render('login',{title:'Login',errors: 'email or password is missing' })
      }
});

app.get('/logout', (req, res)=>{
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send(err);
        }else{
            res.render('login',{title:'Login',errors: 'Logout successfully!' })
        }
    });
});


app.listen(process.env.PORT, function(){
    console.log(`Server is running at http://${process.env.HOST}:${process.env.PORT}.`);
});

