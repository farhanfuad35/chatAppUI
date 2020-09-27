const bcrypt = require('bcryptjs');
const db = require('./db');
const SALTROUNDS = 10;

console.log('operation.js initialized');

function saveUser(email, password, status){
    bcrypt.hash(password, SALTROUNDS, (err, hash) => {
        if(err){
            console.log('Error Occured! ', err);
            return false;
        }
        else{
            password = hash;

            var sqlQuery = 'INSERT INTO users (email, password, status) VALUES(\''+email+'\', \''+password+'\', '+status+')';

            db.none(sqlQuery).then((data) => {
                console.log('Signup Successful');
                return true;
            }).catch((err) => {
                console.log('Error Occured! ', err);
                return false;
            })
            
        }
    });
}

function loginUser(email, password){
    // Check if email matches any entry in database
    var sqlQuery = 'SELECT * FROM users WHERE email=\''+email+'\'';
    db.one(sqlQuery).then((data) => {
        var dbEmail = data.email;
        var dbPassword = data.password;
        var dbStatus = data.status;

        if(dbStatus && bcrypt.compareSync(password, dbPassword)){
            console.log('Login Successful');
            return true;
        }
        else{
            console.log('Login Failed');
            return false;
        }
    }).catch((err)=>{console.log(err); return false});
}



module.exports = {saveUser, loginUser};