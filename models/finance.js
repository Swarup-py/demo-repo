const Joi = require('joi');
const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
    currentBalance: {
        type: Number,
        required: true,
        min: 0,
    },
    totalIncome: {
        type: Number,
        required: true,
        min: 0,
    },
    totalExpense: {
        type: Number,
        required: true,
        min: 0,
    }
})

module.exports.financeSchema = financeSchema;