const express = require('express')
const router = express.Router()

const trainerController = require('../controllers/trainerController')
const opportunityController = require('../controllers/opportunrityController')
const operationController = require('../controllers/operationController')
const userController = require('../controllers/userController')
const {authenticateUser} = require('../middleware/authentication')
const { authorizeRoles } = require('../middleware/authorize')

// Trainer Routes
router.get('/trainers', trainerController.getAllTrainers)
router.post('/trainers', trainerController.addTrainer)
router.put('/trainers/:id', trainerController.updateTrainer)
router.delete('/trainers/:id', trainerController.deleteTrainer)

// Opportunity Routes

// Get all opportunities
router.get('/opportunities', opportunityController.getAllOpportunities)
// Add a new opportunity
router.post('/opportunities', opportunityController.addOpportunity)
// Express interest in an opportunity
router.put('/opportunities/:id/interest', opportunityController.expressInterest)

// Operation Routes
router.post('/operations', operationController.createOperation) // Create an operation
router.get('/operations', operationController.getAllOperations) // Get all operations
router.get('/operations/:id', operationController.getOperationById) // Get specific operation
router.put('/operations/:id', operationController.updateOperation) // Update operation
router.delete('/operations/:id', operationController.deleteOperation) // Delete operation
router.put('/operations/:id/assign-trainer', operationController.assignTrainer) // Assign trainer
router.put('/operations/:id/performance', operationController.updatePerformance) // Update performance

// User Routes
router.post('/user/register', userController.register)
router.post('/user/login', userController.login)

// Protected route for getting user profile
router.get('/user/profile', authenticateUser, userController.getProfile)

// Example: Restricted to Admin role
router.get('/user/admin', authenticateUser, authorizeRoles('Admin'), (req, res) => {
    res.json({ message: 'Welcome Admin' })
})


module.exports = router
