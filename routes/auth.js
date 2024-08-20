const {User} = require('../models/users');
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const mgDebugger = require('debug')('app:mong');
const _ = require('lodash'); // advanced underscore
const { compare_pass } = require('../routes/hash');
const config = require('config');

// Middleware to parse JSON
router.use(express.json());

mongoose.connect(config.get('db'))
.then(()=>mgDebugger('Connected to MongoDB...'))
.catch((err)=>mgDebugger('Error: ', err));


router.post('/', async (req , res)=>{
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) 
        return res.status(400).send('Invalid Email or Password');

    let isValid = await compare_pass(req.body.password, user.password); 
    if (!isValid)
        return res.status(400).send('Invalid Email or Password');

    // json web token
    const token = user.generateAuthToken();
    res.send(token);
    // don't store in database keep it client side
})


function validate(user){
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        // user sent password
        password: Joi.string().min(5).max(255).required()
    })

    const validation = schema.validate(user);
    return validation;
}


module.exports = router;