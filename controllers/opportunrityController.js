const Opportunity = require('../models/Opportunity'); // Correct spelling
const opportunityController = {}; // Correct spelling

// Get all opportunities
opportunityController.getAllOpportunities = (req, res) => {
    Opportunity.find()
        .then((opportunities) => res.json(opportunities))
        .catch((err) => res.status(500).json({ message: err.message }));
};

// Add a new opportunity
opportunityController.addOpportunity = (req, res) => {
    const opportunity = new Opportunity(req.body); // Correct model and variable
    opportunity.save()
        .then((opportunity) => res.status(201).json(opportunity))
        .catch((err) => res.status(400).json({ message: err.message }));
};

// Express interest in an opportunity
opportunityController.expressInterest = (req, res) => {
    Opportunity.findByIdAndUpdate(
        req.params.id,
        {
            $push: { trainersInterested: req.body.trainerId },
            status: 'Interest Expressed'
        },
        { new: true } // Return updated document
    )
        .then((opportunity) => res.json(opportunity))
        .catch((err) => res.status(400).json({ message: err.message }));
};

module.exports = opportunityController; // Correct spelling
