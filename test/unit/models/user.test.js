
const { User } = require('../../../models/user');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
    it('should return a valid jwt', () => {
        const payload = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const user = new User(payload); // create a new user
        const token = user.generateAuthToken() // generate a jwt
        const decoded = jwt.verify(token, config.get('jwtPrivateKey')); // decode that token with the private key
        expect(decoded).toMatchObject(payload); // check if payload equals to decoded
    });
});