const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/cutomer')


router.get('/', async (req, res) => {
  let result = await Customer.find();
  res.send(result);
});
router.post('/', async (req, res) => {
  let { error } = validate(req.body);// client-side validation 
  if (error) return res.status(400).send(error.details[0].message);
  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });
  try {
    let result = await customer.save();
    res.send(result);
  }
  catch (ex) {
    return ex;
  }
});
router.put('/:id', async (req, res) => {
  let { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let customercheck = await Customer.find({ _id: req.params.id });
  if (customercheck.length === 0) return res.status(404).send('The customer with the given ID was not found.');
  let result = await Customer.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
      }
    });
  res.send(result);

});
router.delete('/:id', async (req, res) => {
  let result = await Customer.deleteOne({ _id: req.params.id }, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});
router.get('/:id', async (req, res) => {
  let customercheck = await Customer.find({ _id: req.params.id });
  if (customercheck.length === 0) return res.status(404).send('The customer with the given ID was not found.');
  res.send(customercheck);
});
module.exports = router;