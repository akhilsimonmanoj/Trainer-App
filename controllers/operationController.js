const Operation = require('../models/Operation')
const Trainer = require('../models/Trainer')
const Opportunity = require('../models/Opportunity')
const operationController = {}

// ✅ Create a new operation (Schedule a session)
operationController.createOperation = async (req, res) => {
    try {
        const { scheduledDate, trainer, opportunity } = req.body

        // Validate trainer & opportunity exist
        const trainerExists = await Trainer.findById(trainer)
        const opportunityExists = await Opportunity.findById(opportunity)

        if (!trainerExists || !opportunityExists) {
            return res.status(404).json({ message: 'Trainer or Opportunity not found' })
        }

        const newOperation = new Operation({ scheduledDate, trainer, opportunity })
        await newOperation.save()

        res.status(201).json({ message: 'Operation scheduled successfully', operation: newOperation })
    } catch (error) {
        res.status(500).json({ message: 'Error creating operation', error: error.message })
    }
}

// ✅ Get all operations
operationController.getAllOperations = async (req, res) => {
    try {
        const operations = await Operation.find()
            .populate('trainer', 'name email') // Fetch trainer details
            .populate('opportunity', 'name type') // Fetch opportunity details

        res.status(200).json(operations)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching operations', error: error.message })
    }
}

// ✅ Get operation by ID
operationController.getOperationById = async (req, res) => {
    try {
        const operation = await Operation.findById(req.params.id)
            .populate('trainer', 'name email')
            .populate('opportunity', 'name type')

        if (!operation) {
            return res.status(404).json({ message: 'Operation not found' })
        }

        res.status(200).json(operation)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching operation', error: error.message })
    }
}

// ✅ Update operation (Update trainer, date, or status)
operationController.updateOperation = async (req, res) => {
    try {
        const { scheduledDate, trainer, status, performance } = req.body // ✅ Include performance
        const operation = await Operation.findById(req.params.id)

        if (!operation) {
            return res.status(404).json({ message: 'Operation not found' })
        }

        // ✅ Update fields if provided
        if (scheduledDate) operation.scheduledDate = scheduledDate
        if (trainer) operation.trainer = trainer
        if (status) operation.status = status
        if (performance) operation.performance = performance // ✅ Add performance update

        await operation.save()
        res.status(200).json({ message: 'Operation updated successfully', operation })
    } catch (error) {
        res.status(500).json({ message: 'Error updating operation', error: error.message })
    }
}


// ✅ Delete an operation
operationController.deleteOperation = async (req, res) => {
    try {
        const operation = await Operation.findByIdAndDelete(req.params.id)

        if (!operation) {
            return res.status(404).json({ message: 'Operation not found' })
        }

        res.status(200).json({ message: 'Operation deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Error deleting operation', error: error.message })
    }
}

// ✅ Assign a trainer to an existing operation
operationController.assignTrainer = async (req, res) => {
    try {
        const { trainer } = req.body
        const operation = await Operation.findById(req.params.id)

        if (!operation) {
            return res.status(404).json({ message: 'Operation not found' })
        }

        // Validate trainer exists
        const trainerExists = await Trainer.findById(trainer)
        if (!trainerExists) {
            return res.status(404).json({ message: 'Trainer not found' })
        }

        operation.trainer = trainer
        await operation.save()

        res.status(200).json({ message: 'Trainer assigned successfully', operation })
    } catch (error) {
        res.status(500).json({ message: 'Error assigning trainer', error: error.message })
    }
}

// ✅ Update trainer performance in an operation
operationController.updatePerformance = async (req, res) => {
    try {
        const { performance } = req.body
        const operation = await Operation.findById(req.params.id)

        if (!operation) {
            return res.status(404).json({ message: 'Operation not found' })
        }

        // Validate performance input
        const validPerformanceValues = ['Excellent', 'Good', 'Needs Improvement']
        if (!validPerformanceValues.includes(performance)) {
            return res.status(400).json({ message: 'Invalid performance rating' })
        }

        operation.performance = performance
        await operation.save()

        res.status(200).json({ message: 'Trainer performance updated', operation })
    } catch (error) {
        res.status(500).json({ message: 'Error updating performance', error: error.message })
    }
}

module.exports = operationController
