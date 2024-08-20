const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // www.jwt.io
const config = require('config');
const { financeSchema } = require('./finance');

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    // npm package -> joi-password-complexity
    // use this check the complexity of password
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024, // because of hashing
    },
    finance:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Finance'
    }
 });
 
 // methods for user
 usersSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id}, config.get('jwtPrivateKey'));
    return token;
 }

const Finance = mongoose.model('Finance', financeSchema);
const User = mongoose.model('User', usersSchema);

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        // user sent password
        password: Joi.string().min(5).max(255).required(),
        currentBalance: Joi.number().min(0).required(),
        totalIncome: Joi.number().min(0).required(),
        totalExpense: Joi.number().min(0).required(),
    });

    const validation = schema.validate(user);
    return validation;
}

exports.User = User;
exports.Finance = Finance;
exports.validate = validateUser;

