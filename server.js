const PORT = 55555;
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const config = require('config');
const jwtConfig = config.get('jwt');
const path = require('path');
const bodyParser = require('body-parser');
const dbOp = require('./database/operation');
const { JsonWebTokenError } = require('jsonwebtoken');
const db = require('./database/db');



// Authentication function
// This function will be used as a middleware of the app.get('/'). It will check if an user is already logged in
// If received authorization token is verified, it will 
var authentication = async function authenticateToken(req, res){
    console.log('I have come to authenticate token');
    try{
        const token = await req.cookies.accessToken;
        if(token){
            console.log(token);
            jwt.verify(token, jwtConfig.ACCESS_TOKEN, (err, user) => {
                if(err){ 
                    console.log('Token did not match');
                    return res.status(403).sendFile(path.join(__dirname, 'public', 'home.html'));
                }
                else{
                    console.log('Token matched');
                    req.user = user;
                    return status(200).sendFile(path.join(__dirname, 'public', 'home.html'));
                }
            });
        }
        else{ 
            console.log('Token was not found');
            return res.status(401).sendFile(path.join(__dirname, 'public', 'home.html'));
        }
    }catch{(err) => {
        console.log('Error occured ' + err);
    }};
}



// Enable Perser First. Strictly before routing. Must needed for POST/PUT request in Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

// Check Authentication
//app.use(authentication);

// Static location
app.use(express.static(path.join(__dirname, 'public')));

// Route to auth
app.use('/auth/', require('./routes/auth'));
app.get('/', authentication);




// Start Server
app.listen(PORT, () => console.log('Listening to port', PORT));
