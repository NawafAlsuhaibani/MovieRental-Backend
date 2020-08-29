const _ = require('lodash');
const Joi = require('@hapi/joi');
const express = require('express');
const config = require('config');
const bcrybt = require('bcrypt')
const router = express.Router();
const {User} = require('../models/user');

router.post('/', async (req, res) => {
    let { error } = validate(req.body);// client-side validation 
    if (error) return res.status(400).send(error.details[0].message);

    let checkUser = await User.find({ email: req.body.email });// If user exsists 
    if (checkUser.length===0) return res.status(400).send('The user/password are invalid');
    // I validate the passwod from client side to what I have in db.
    const validatepassword = await bcrybt.compare(req.body.password, checkUser[0].password);
    if(!validatepassword) return res.status(400).send('The user/password are invalid');
    // if user login successfully..generat token. send it to client  
    try {
        const token = checkUser[0].generateAuthToken();
       // await user.save();
        res.send(token);
    }
    catch (ex) {
        res.send(ex.message);
    }
});

function validate(req) {
    const schema = Joi.object(
        {
            email: Joi.string().min(5).max(255).required().email(),
            password: Joi.string().required()
        }
    );
    return schema.validate(req);
}
module.exports = router;