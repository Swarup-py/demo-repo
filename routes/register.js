const {User, Finance,validate} = require('../models/users');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const mgDebugger = require('debug')('app:mong');
const _ = require('lodash'); // advanced underscore
const { hash_pass } = require('../routes/hash');
const auth = require('../middleware/auth');
const config = require('config');

// Middleware to parse JSON
router.use(express.json());

mongoose.connect(config.get('db'))
.then(()=>mgDebugger('Connected to MongoDB...'))
.catch((err)=>mgDebugger('Error: ', err));

router.get('/me', auth, async (req,res) => {
    const user = await User.findById(req.user._id)
                        .select('-password');
    res.send(user);
})

router.post('/', async (req , res)=>{
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) 
        return res.status(400).send('Email already in use');

    const finance = new Finance(_.pick(req.body, ['currentBalance',
        'totalIncome','totalExpense']));
    await finance.save();

    user = new User(_.pick(req.body, ['name','email','password']));
    user.password = await hash_pass(user.password);
    user.finance = finance._id;
    await user.save();

    // setting response header
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id','name', 'email']));
})


module.exports = router;