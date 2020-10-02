const config = require('config');
const jwtConfig = config.get('jwt');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const route = express.Router();
const saltRounds = 10;
const db = require('../database/db');
const dbOp = require('../database/operation');
const { nextTick } = require('process');

console.log('auth.js initialized');

// ### Login Request ###
// ---------------------

route.post('/login',async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    const user = {
        email: email,
        password: password
    };
    console.log("Received login Request");

    var loginSuccessful = await dbOp.loginUser(user);
    console.log('login: '+loginSuccessful);
    if(loginSuccessful){
        // Create JSON web token
        const accessToken = jwt.sign(user, jwtConfig.ACCESS_TOKEN, {expiresIn: '1h'});

        // Refresh token is used to generate a new access token in case the old AT is expired or compromised.
        // For our purpose it's not necessary. User can just relogin if the token is expired.
        // Therefore, we are not really going to use this token. But it is generated here for future development.
        const refreshToken = jwt.sign(user, jwtConfig.REFRESH_TOKEN);

        console.log(accessToken);
        await res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: "lax" });
        await res.status(201).json({accessToken});
        console.log('Login successful. Response Sent');
    }
    else{
        res.status(400).send('<h1>An Error Occured. Please Try Again Later</h1>');
    }
})

// ### SIGN UP REQUEST ###
// -----------------------


route.post('/signup', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var status = true;
    console.log("Received signup Request");

    var saveSuccessful = dbOp.saveUser(email, password, status);
    if(saveSuccessful){
        res.status(201).send('SignUp Successfull');
    }
    else{
        res.status(400).send('<h1>An Error Occured. Please Try Again Later</h1>');
    }
});


route.get('/authenticate', (req, res, next) => {
    authenticateToken(req, res);
    return;
})


// ### AUTHENTICATE TOKEN ###
// --------------------------


// Authentication function
// This function will be used as a middleware of the app.get('/'). It will check if an user is already logged in
// If received authorization token is verified, it will 
async function authenticateToken(req, res){
    console.log('I have come to authenticate token');
    try{
        const token = await req.cookies.accessToken;
        if(token){
            jwt.verify(token, jwtConfig.ACCESS_TOKEN, (err, user) => {
                if(err){ 
                    console.log('Token did not match');
                    return res.status(403).sendFile(path.join(__dirname, '..', 'public', 'home.html'));
                }
                else{
                    console.log('Token matched');
                    req.user = user;
                    return res.status(200).sendFile(path.join(__dirname, '..', 'public', 'home.html'));
                }
            });
        }
        else{ 
            console.log('Token was not found');
            return res.status(401).sendFile(path.join(__dirname, '..', 'public', 'home.html'));
        }
    }catch{(err) => {
        console.log('Error occured ' + err);
        res.status(401);
    }};
}

module.exports.route = route;
module.exports.authenticateToken = authenticateToken;