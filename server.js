const PORT = 55555;
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const config = require('config');
const jwtConfig = config.get('jwt');
const path = require('path');
const bodyParser = require('body-parser');
const dbOp = require('./database/operation');
const { JsonWebTokenError } = require('jsonwebtoken');
const db = require('./database/db');

// Enable Perser First. Strictly before routing. Must needed for POST/PUT request in Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static location


// Route to auth
app.use('/auth/', require('./routes/auth'));
app.get('/', authenticateToken, async (req, res) => {
    console.log('Redirected from server.js')
    // If you want to reverify user details from database, do it here. It seems unnecessary for now.
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use(express.static(path.join(__dirname, 'public')));

// Authentication function
// This function will be used as a middleware of the app.get('/'). It will check if an user is already logged in
// If received authorization token is verified, it will 
function authenticateToken(req, res, next){
    console.log('I have come to authenticate token');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token){
        jwt.verify(token, jwtConfig.ACCESS_TOKEN, (err, user) => {
            if(err){ 
                console.log('Token did not match');
                return res.sendStatus(403);
            }
            else{
                req.user = user;
                next();
            }
        });
    }
    else{ 
        console.log('Token was not found');
        return res.sendStatus(401);
    }
}

// Start Server
app.listen(PORT, () => console.log('Listening to port', PORT));
