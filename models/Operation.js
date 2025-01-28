const mongoose = require('mongoose');

const operationSchema = new mongoose.Schema({
    sessionDate: { type: Date, required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    performance: { type: String } // e.g., Excellent, Good, Needs Improvement
});

const Operation = mongoose.model('Operation', operationSchema);
module.exports = Operation;
