
const handleSignin = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    if (!email || !password) {
        res.status(400).json('Incorrect credentials.')
    }

    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then (login => {
        bcrypt.compare(password, login[0].hash).then(isValid => {
            if (isValid) {
                return db.select('*').from('users')
                .where('email', '=', email)
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
};

module.exports = {
    handleSignin: handleSignin
}