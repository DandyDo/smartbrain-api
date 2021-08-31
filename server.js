const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();
app.use(express.json());
app.use(cors());

const db = knex({
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'your username', // insert your username
      password : 'your password', // insert your db password
      database : 'your database' // insert your db name
    }
});

app.get('/', (req, res) => {
    res.send('Success.'); 
});

// Sign In
app.post('/signin', (res, req) => { signin.handleSignin(res, req, db, bcrypt) });

// Register
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
        

// Profile
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) });

// Image
app.put('/image', (req, res) => { image.handleImage(req, res, db) });

app.listen(3000, () => {
    console.log('app is running on port 3000');
});
