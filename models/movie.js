const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const { GenreSchema } = require('../models/genre')
const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    numberInStock: {
        type: Number,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        default: 0
    },
    genre: {
        type: GenreSchema,
        required: true
    }
}));
function validateMovie(movie) { //checks of the body is the same as what's required
    let schema = Joi.object({
        title: Joi.string().min(5).max(50).required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required(),
        genreId: Joi.objectId().required(),
    });
    return schema.validate(movie);
}
exports.Movie = Movie;
exports.validate = validateMovie;