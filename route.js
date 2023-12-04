//create a schema
// app.get('/selectall', function (req, res) {
//     let sql = 'SELECT * FROM students';

//     db.query(sql, (err, result)=>{
//         if(err){
//             throw err;
//         }else{
//             console.log(result);
//             res.send(result);
//         }
//     });

// });

//insert a table
// app.get('/createtable', function (req, res) {
//     let sql = `CREATE TABLE users (
//         id INT AUTO_INCREMENT NOT NULL,
//         username VARCHAR(255) UNIQUE NOT NULL,
//         password VARCHAR(255) NOT NULL,
//         PRIMARY KEY (id)
//     )`;

//     db.query(sql, (err, result)=>{
//         if(err){
//             throw err;
//         }else{
//             console.log(result);
//             res.send(result);
//         }
//     });
// });

//insert new row
app.get('/insertnewrow', function (req, res) {
    let newRow = {email: 'user2@test.com', password: '123456'}
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

//select all rows from a table
app.get('/selectall', function (req, res) {
    let sql = `SELECT * FROM users`;

    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        }else{
            console.log(result);
            res.send(result);
        }
    });
});

//select a row from a table
app.get('/user/:id', function (req, res) {
    let sql = `SELECT * FROM users WHERE id = ${req.params.id}`;

    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        }else{
            console.log(result);
            res.send(result);
        }
    });
});

//update a row from a table
app.get('/user/:id/update', function (req, res) {
    let sql = `UPDATE users SET password = '12313123' WHERE id = ${req.params.id}`;

    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        }else{
            res.send(`user id ${req.params.id} has been updated!`);
        }
    });
});


//delete a row from a table
app.get('/user/:id/delete', function (req, res) {
    let sql = `DELETE FROM users WHERE id = ${req.params.id}`;

    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        }else{
            res.send(`user id ${req.params.id} has been deleted!`);
        }
    });
});