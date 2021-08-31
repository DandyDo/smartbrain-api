
const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    const saltRounds = 10;

    if (!email || !name || !password) {
        res.status(400).json('Incorrect credentials.')
    }

    bcrypt.hash(password, saltRounds)
    .then(function(hash) {
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
        .catch(trx.rollback);                     
        });
    })
    .catch(() => res.status(400).json('Unable to register.'));
};

module.exports = {
    handleRegister: handleRegister
};