const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql');
const path = require('path')
const tokens = require('csrf');
const port = 3000;
const host = '127.0.0.1'; 

const app = express()

//database credentials
const db = mysql.createConnection({
    'host': host,
    'user': 'root',
    'password': '',
    'database': 'kodego_db',
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

app.post('/signup', (req, res)=>{
    let newRow = {email: req.body.email, password: req.body.password}
    let sql = `INSERT INTO users SET?`;

    db.query(sql, newRow, (err, result)=>{
        if(err){
            throw err;
        }else{
          res.redirect('/dashboard');
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
        req.session.user = req.body.email;
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
            res.redirect('/login');
        }
    });
});


app.listen(port, function(){
    console.log(`Server is running at http://${host}:${port}.`);
});

