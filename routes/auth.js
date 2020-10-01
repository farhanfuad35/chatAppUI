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

console.log('auth.js initialized');

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
        // Send JSON web token
        const accessToken = jwt.sign(user, jwtConfig.ACCESS_TOKEN);
        //console.log(accessToken);
        res.status(201).send(accessToken);
    }
    else{
        res.status(400).send('<h1>An Error Occured. Please Try Again Later</h1>');
    }
})

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

module.exports = route;