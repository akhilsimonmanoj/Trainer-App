const mongoose = require('mongoose')
const Schema = mongoose.Schema

const oppurtunitySchema = new Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    interestedTrainers: [{ type: Schema.Types.ObjectId, ref: 'Trainer'}],
    assignedTrainers: [{ type: Schema.Types.ObjectId, ref: 'Trainer' }],
}, {timestamps: true})

const Oppurtunity = mongoose.model('Oppurtunity', oppurtunitySchema)
module.exports = Oppurtunity