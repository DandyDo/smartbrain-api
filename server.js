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
      connectionString: process.env.DATABASE_URL,
      ssl: { // NOT SECURE should be set to true but currently using free version of Heroku
        rejectUnauthorized: false
      }
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

// Clarifai API
app.post('/imageurl', (req, res) => { image.handleAPICall(req, res) });

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});
