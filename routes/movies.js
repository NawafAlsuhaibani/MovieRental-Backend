const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie')
const { Genre } = require('../models/genre')


router.get('/', async (req, res) => {// GET all movies
    try{
        let result = await Movie.find();
        res.send(result);
    }
    catch(ex){
        res.status(500).send('Somthing happend internally')
    }
    
});
router.post('/', async (req, res) => { // Add a movie
    try {
        let { error } = validate(req.body);// client-side validation 
    if (error) return res.status(400).send(error.details[0].message);
    let checkGenre = await Genre.find({ _id: req.body.genreId });
    if (checkGenre.length === 0) return res.send('The genre with the given ID was not found')

    let movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: checkGenre[0]._id,
            name: checkGenre[0].name
        }
    });
        let result = await movie.save();
        res.send(result);
    }
    catch (ex) {
        res.status(500).send('Somthing happend internally')
    }
});
router.put('/:id', async (req, res) => {// Edit a movie 
    let { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let moviecheck = await Movie.find({ _id: req.params.id });
    if (moviecheck.length === 0) return res.status(404).send('The movie with the given ID was not found.');
    let checkGenre = await Genre.find({ _id: req.body.genreId });
    if (checkGenre.length === 0) return res.send('The genre with the given ID was not found')
    let result = await Movie.updateOne(
        { _id: req.params.id },
        {
            $set: {
                title: req.body.title,
                genre: {
                    _id: checkGenre[0]._id,
                    name: checkGenre[0].name
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            }
        });
    res.send(result);

});
router.delete('/:id', async (req, res) => {// Remove a movie from db
    let result = await Movie.deleteOne({ _id: req.params.id }, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});
router.get('/:id', async (req, res) => {// GET a specific movie
    let moviecheck = await Movie.find({ _id: req.params.id });
    if (moviecheck.length === 0) return res.status(404).send('The movie with the given ID was not found.');
    let movieDetalis = {
        title: moviecheck[0].title,
        genre: moviecheck[0].genre.name,
        numberInStock: moviecheck[0].numberInStock,
        dailyRentalRate: moviecheck[0].dailyRentalRate
    }
    res.send(movieDetalis);
});
module.exports = router;