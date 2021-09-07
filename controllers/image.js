const Clarifai = require('clarifai');

// Clarifai API (Don't forget to set your API key)
const app = new Clarifai.App({
    apiKey: process.env.CLARIFAI_API,
});

// Get the response from Clarifai API (Replace 'Model ID' with the FACE_EMBED_MODEL from their github)
const handleAPICall = (req, res) => {
    app.models.predict('e15d0f873e66047e579f90cf82c9882z', req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(() => res.status(400).json('Error with input.'));
}


// Update user entries after getting the image detected
const handleImage = (req, res, db) => {
    const { id } = req.body;

    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(() => res.status(400).json('Unable to get entries.'));
};

module.exports = {
    handleImage: handleImage,
    handleAPICall: handleAPICall
}