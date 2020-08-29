const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const GenreSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: false,
    minlength: 1
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
})
const Genre = mongoose.model('Genre', GenreSchema);
  function validateGenre(course) { //checks of the body is the same as what's required
  let schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    id: Joi.number().optional()
  });
  return schema.validate(course);
}
exports.Genre = Genre;
exports.validate = validateGenre;
exports.GenreSchema=GenreSchema;