const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const passwordComplexity = require('joi-password-complexity');
const UserSchema = new mongoose.Schema({
    isAdmin : Boolean,
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 1024,//Hashed password can be longer so, 1024 but in Joi validation, we use 255 as the one from req.body is a plain text password.
        required: true
    }
});
UserSchema.methods.generateAuthToken = function(){
    const token =  jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get('jwtPrivateKey'));
    return token;
};
const User = mongoose.model('User', UserSchema);

function validateUser(user) {
    const complexityOptions = {
        min: 8,
        max: 255,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 4,
    };
    //passwordComplexity(complexityOptions).validate(user.password);
    const schema = Joi.object(
        {
            name: Joi.string().min(2).max(50).required(),
            email: Joi.string().min(5).max(255).required().email(),
            password: passwordComplexity(complexityOptions)
        }
    );
    return schema.validate(user)
}
exports.User = User;
exports.validate = validateUser;