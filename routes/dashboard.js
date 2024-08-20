const  auth = require('../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', auth, async(req, res)=>{
    // do something here
})

module.exports = router;