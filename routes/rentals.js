const express = require('express');
const router = express.Router();
const { Movie } = require('../models/movie');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/cutomer');

router.get('/', async (req, res) => {// GET all rentals
    try{
        let result = await Rental.find();
        res.send(result);
    }
    catch(ex){
        res.status(500).send('Somthing happend internally')
    }
    
});
router.post('/', async (req, res) => { // Add a rental

    let { error } = validate(req.body);// client-side validation 
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let checkcustomer = await Customer.find({ _id: req.body.customerID });
        if (checkcustomer.length === 0) return res.send('The customer with the given ID was not found')
        let checkmovie = await Movie.find({ _id: req.body.movieID });
        if (checkmovie.length === 0) return res.send('The movie with the given ID was not found')
        if (checkmovie[0].numberInStock === 0) return res.send('The movie you selected is out of stock')
        let rental = new Rental({
            customer: {
                _id: req.body.customerID,
                name: checkcustomer[0].name,
                isGold: checkcustomer[0].isGold,
                phone: checkcustomer[0].phone
            },
            movie: {
                _id: req.body.movieID,
                title: checkmovie[0].title
            }
        });
        const session = await Rental.startSession();
        session.startTransaction();

        try {
            let result = await rental.save();
            let updatesctock = await Movie.updateOne(
                { _id: req.body.movieID },
                {
                    $inc: {
                        numberInStock: -1,
                    }
                });
            await session.commitTransaction();
            session.endSession();
            if (updatesctock.nModified === 0) return res.send('movie rented is not successfully');
            res.send('movie is rented is successfully');
        } catch (ex) {
            await session.abortTransaction();
            session.endSession();
            console.log(err);
            return res.status(500).send(ex.message);
        }
    }
    catch (ex) {
        return res.send(ex);
    }
});
module.exports = router;