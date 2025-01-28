const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    trainersInterested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' }], // Array of trainer IDs
    status: { type: String, default: 'Open' }
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
module.exports = Opportunity;
