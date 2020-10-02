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
const auth = require('./routes/auth')


// Enable Perser First. Strictly before routing. Must needed for POST/PUT request in Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

// Check Authentication
//app.use(authentication);

// Static location
app.use(express.static(path.join(__dirname, 'public')));

// Route to auth
app.use('/auth/', auth.route);
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'public', 'home.html')));




// Start Server
app.listen(PORT, () => console.log('Listening to port', PORT));
