
const handleSignin = (req, res, db, bcrypt) => {
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
};

module.exports = {
    handleSignin: handleSignin
}