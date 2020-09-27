const PORT = 55555;
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Enable Perser First. Strictly before routing. Must needed for POST/PUT request in Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static location
app.use(express.static(path.join(__dirname, 'public')));


// Route to auth
app.use('/auth/', require('./routes/auth'));
app.get('/', (req, res) => {
    res.redirect('/auth/login');
})

// app.post('/test',(req, res) => {
//     console.log("Received POST Request");
//     console.log(req.body);
//     res.send('Request Received');
// })

// Start Server
app.listen(PORT, () => console.log('Listening to port', PORT));
