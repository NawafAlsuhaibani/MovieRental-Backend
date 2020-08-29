const auth = require('../middleware/auth')
const bcrybt = require('bcrypt')
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');

router.get('/me', auth ,async (req, res) => {
    try{
        let result = await User.find({ _id:req.user._id }).select('-password');
        res.send(req.user);
    }
    catch(ex){
        res.status(500).send('Somthing happend internally')
    }
    
});

router.post('/', async (req, res) => {
    let { error } = validate(req.body);// client-side validation 
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let checkUser = await User.find({ email: req.body.email });
        if (checkUser.length > 0) return res.send('The user with the email already exists')
        let user = new User(_.pick(req.body, ['name', 'email', 'password']));
        const salt = await bcrybt.genSalt(10);
        user.password = await bcrybt.hash(user.password ,salt)
        const token = user.generateAuthToken();
        await user.save();
        res.header('-x-auth-token',token).send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch (ex) {
        res.send(ex);
    }
});
module.exports = router;