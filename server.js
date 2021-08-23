const { response } = require('express');
const express = require('express');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const database = {
    users: [
        {
            id: '123',
            name: 'Ammar',
            email: 'ammar@gmail.com',
            entries: 0,
            joined: new Date(),
        },
        {
            id: '124',
            name: 'Nader',
            email: 'nader@gmail.com',
            entries: 0,
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
        res.json('sucess');
    } else {
        res.status(400).json('error logging in.')
    }
});

// Register
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    
    res.json(database.users[database.users.length-1]);
});

// Profile
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;

    //check if user found in database
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    });

    if(!found) {
        res.status(400).json('User not found.');
    }
});

// Image
app.post('/image', (req, res) => {
    const { id } = req.body;
    let found = false;

    //check if user found in database
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });

    if(!found) {
        res.status(400).json('User not found.');
    }
});

app.listen(3000, () => {
    console.log('app is running on port 3000');
});
