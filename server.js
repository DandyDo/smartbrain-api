const { response } = require('express');
const express = require('express');

const app = express();

app.use(express.json());

const database = {
    users: [
        {
            id: '123',
            name: 'Ammar',
            email: 'ammar@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date(),
        },
        {
            id: '124',
            name: 'Nader',
            email: 'nader@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date(),
        }
    ]
}

app.get('/', (req, res) => {
    res.send('this is working');
});

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password == database.users[0].password) {
        res.json('sucess');
    } else {
        res.status(400).json('error logging in.')
    }
    res.json('signing');
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
});
