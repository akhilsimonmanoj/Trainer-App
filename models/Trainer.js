const mongoose = require('mongoose')
const { applyTimestamps } = require('./User')
const Schema = mongoose.Schema

const trainerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    skills: {
        type: [String]
    },
    availability: {
        type: Boolean,
        default: true
    },
    experience: {
        type: Number
    }
}, {timestamps: true})

const Trainer = mongoose.model('Trainer', trainerSchema)
module.exports = Trainer
