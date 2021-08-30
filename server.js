const { response } = require('express');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('knex');
const { reset } = require('nodemon');

const app = express();
app.use(express.json());
app.use(cors());

const db = knex({
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'dandydo',
      password : 'ibtihal21',
      database : 'smartbrain'
    }
});

app.get('/', (req, res) => {
    res.send('Success.'); 
});

// Sign In
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then (login => {
        bcrypt.compare(req.body.password, login[0].hash).then(isValid => {
            if (isValid) {
                return db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(() => res.status(400).json('Unable to find user.'));
            }
            else {
                res.status(400).json('Wrong credentials.');
            }
        });
    })
    .catch(() => res.status(400).json('Wrong credentials.'));
});

// Register
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds).then(function(hash) {
        db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
                        
        })
        .catch(() => res.status(400).json('Unable to register.'));  
    });
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
