const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const expressSession = require('express-session');
const expressValidator = require('express-validator');
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


app.get('/signup', (req,res)=>{
    res.render('signup');
});

app.post('/signup', (req, res)=>{
    let newRow = {email: req.body.email, password: req.body.password}
    let sql = `INSERT INTO users SET?`;

    db.query(sql, newRow, (err, result)=>{
        if(err){
            throw err;
        }else{
            console.log(result);
            res.send('new row has been inserted!');
        }
    });
});


app.listen(port, function(){
    console.log(`Server is running at http://${host}:${port}.`);
});

