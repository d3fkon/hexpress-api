const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user-model');
/*
    *username: String,
    *accessLevel: Number,
    *email: String,
    *password: String,
    *token: String
*/

// Sign up. Generate a jwt in the response
router.post('/', (req, res) => {
    const token = jwt.sign({ username: req.body.username, accessLevel: req.body.accessLevel }, 'shhhhhhared-secret');
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        const newUser = new User({ ...req.body, accessLevel: parseInt(req.body.accessLevel), token, password: hash });
        newUser.save((err, user) => {
            if (err) {
                res.json({
                    error: 1,
                    message: 'One or more fields are incorrect'
                })
            }
            res.json({
                success: 1,
                token
            })
        })
    });
})

// Actual login process
router.post('/check', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if(err) {
            res.send(err)
        }
        bcrypt.compare(req.body.password, user.password, (err, resx) => {
            res.send(
                resx
                ? {success: 1, token: user.token}
                : {error: 1, message: 'invalid password'}
             )
        });
    })
})

// Access Token check
router.get('/',
    (req, res) => {
        jwt.verify(req.headers['x-access-token'], 'shhhhhhared-secret',  (err, decoded) => {
            if (err) {
                res.redirect('/')
            }
            User.findOne({ token: req.headers['x-access-token'] }, (err, user) => {
                if (err) {
                    res.json({ error: 1, message: 'failed auth' })
                }
                res.json(user)
            })
        });
    });

module.exports = router;