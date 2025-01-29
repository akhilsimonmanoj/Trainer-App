const Opportunity = require('../models/Opportunity') // Correct spelling
const opportunityController = {} // Correct spelling

// Get all opportunities
opportunityController.getAllOpportunities = (req, res) => {
    Opportunity.find()
        .then((opportunities) => res.json(opportunities))
        .catch((err) => res.status(500).json({ message: err.message }))
}

// Add a new opportunity
opportunityController.addOpportunity = (req, res) => {
    const opportunity = new Opportunity(req.body) // Correct model and variable
    opportunity.save()
        .then((opportunity) => res.status(201).json(opportunity))
        .catch((err) => res.status(400).json({ message: err.message }))
}

// Express interest in an opportunity
opportunityController.expressInterest = (async (req, res) => {
    try {
      const { interestType } = req.body
      const opportunity = await Opportunity.findById(req.params.id)
  
      if (!opportunity) {
        return res.status(404).json({ message: 'Opportunity not found' })
      }
  
      // Add the user ID to the trainersInterested array
      opportunity.trainersInterested.push(req.params.id)
  
      // Optionally, you can update the status or any other fields
      if (interestType) {
        opportunity.status = 'Interest Expressed' // or any other logic
      }
  
      await opportunity.save()
  
      res.status(200).json(opportunity) // Respond with updated opportunity
    } catch (error) {
      res.status(500).json({ message: 'Error updating interest', error })
    }
  })

module.exports = opportunityController // Correct spelling
