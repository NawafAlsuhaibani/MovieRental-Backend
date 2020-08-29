const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const express = require('express');
const { Genre, validate } = require('../models/genre');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (req, res) => {
  let result = await Genre.find();
  res.send(result);
});
router.post('/', auth, async (req, res) => {
  let { error } = validate(req.body);// client-side validation 
  if (error) return res.status(400).send(error.details[0].message);
  let genre = new Genre({
    name: req.body.name,
    id: req.body.id
  });
  try {
    let result = await genre.save();
    res.send(result);
  }
  catch (ex) {
    return ex;
  }
});
router.put('/:id', async (req, res) => {
  let { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let genrecheck = await Genre.find({ _id: req.params.id });
  if (genrecheck.length === 0) return res.status(404).send('The genre with the given ID was not found.');
  let result = await Genre.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
      }
    });
  res.send(result);
});
router.delete('/:id', [auth, admin], async (req, res) => {
  let result = await Genre.deleteOne({ _id: req.params.id }, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});
router.get('/:id', validateObjectId, async (req, res) => {
  let genrecheck = await Genre.find({ _id: req.params.id });
  if (genrecheck.length === 0) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genrecheck);
});
module.exports = router;