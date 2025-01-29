const mongoose = require('mongoose')

const operationSchema = new mongoose.Schema({
    scheduledDate: { type: Date, required: true }, // When the session is scheduled
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true }, // Assigned trainer
    opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true }, // Related opportunity
    performance: { 
        type: String, 
        enum: ['Excellent', 'Good', 'Needs Improvement'], 
        default: 'Good' 
    }, // Performance rating
    status: { 
        type: String, 
        enum: ['Scheduled', 'Completed', 'Cancelled'], 
        default: 'Scheduled' 
    } // Status tracking
}, { timestamps: true }) // Adds createdAt and updatedAt

module.exports = mongoose.model('Operation', operationSchema)
