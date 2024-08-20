const express = require('express'); 
const app = express();
const config = require('config'); // npm i config

if (!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined')
    process.exit(1);
}

const register = require('./routes/register');
app.use('/api/register', register);

const auth = require('./routes/auth');
app.use('/api/auth', auth);

const dashboard = require('./routes/dashboard');
app.use('/api/dashboard', dashboard);

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on ${port}`));