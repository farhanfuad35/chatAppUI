const path = require('path');
const bcrypt = require('bcryptjs');
const express = require('express');
const route = express.Router();
const saltRounds = 10;
const db = require('../database/db');
const dbOp = require('../database/operation');

console.log('auth.js initialized');

route.get('/login',(req, res) => {
    res.sendFile('index');
});

route.post('/login',(req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    console.log("Received login Request");

    var loginSuccessful = dbOp.loginUser(email, password);
    if(loginSuccessful){
        res.status(201).send('Login Successfull');
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