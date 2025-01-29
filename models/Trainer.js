const mongoose = require('mongoose')

const trainerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    expertise: [{ type: String, required: true }],
    availability: { type: Boolean, default: true },
    experience: {
        type: Number
    },
    contactInfo: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const Trainer = mongoose.model('Trainer', trainerSchema)
module.exports = Trainer
