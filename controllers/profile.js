
const handleProfile = (req, res, db) => { 
    db.select('*').from('users').where({id})
    .then(user => {
        if (user.length) {
            res.json(user[0]);
        }
        else {
            res.status(400).json('User not found.')
        }
    })
    .catch(() => res.status(400).json('There was a problem getting the user profile.'));
};

module.exports = {
    handleProfile: handleProfile
}
