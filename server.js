const { response } = require('express');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('knex');

const app = express();
app.use(express.json());
app.use(cors());

const saltRounds = 10;

const db = knex({
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'dandydo',
      password : 'ibtihal21',
      database : 'smartbrain'
    }
});

const database = {
    users: [
        {
            id: '123',
            name: 'Ammar',
            email: 'ammar@gmail.com',
            password: 'cookies',
            entries: 9,
            joined: new Date(),
        },
        {
            id: '124',
            name: 'Nader',
            email: 'nader@gmail.com',
            password: 'bananas',
            entries: 1,
            joined: new Date(),
        }
    ],
    login: [
        {
            id: '',
            hash: '',
            email: '',
        }
    ],
}

app.get('/', (req, res) => {
    res.send(database.users);
});

// Sign In
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password == database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in.')
    }
});

// Register
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    db('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()
    })
    .then(user => {
        res.json(user[0]);
    })
    .catch(() => res.status(400).json('Unable to register.'));
});

// Profile
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    
    db.select('*').from('users').where({id}).then(user => {
        if (user.length) {
            res.json(user[0]);
        }
        else {
            res.status(400).json('User not found.')
        }

    })
    .catch(() => res.status(400).json('There was a problem getting the user profile.'));
});

// Image
app.put('/image', (req, res) => {
    const { id } = req.body;

    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(() => res.status(400).json('Unable to get entries.'));
});

app.listen(3000, () => {
    console.log('app is running on port 3000');
});
