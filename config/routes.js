const express = require('express')
const userController = require('../controllers/userController')
const trainerController = require('../controllers/trainerController')
const oppurtunityController = require('../controllers/oppurtunrityController')
const {authenticateUser} = require('../middleware/authentication')
const router = express.Router()

//USER ROUTES
router.post('/user/register', userController.register)
router.post('/user/login', userController.login)
router.get('/user/account', authenticateUser, userController.getAccount)

//TRAINER ROUTES
router.post('/trainer', trainerController.create)
router.get('/trainer', trainerController.list)
router.put('/trainer/:id', trainerController.update)
router.delete('/trainer/:id', trainerController.delete)

router.post('/oppurtunity', oppurtunityController.create)
router.post('/oppurtunity/interest/:id', oppurtunityController.interest)
router.get('/oppurtunity', oppurtunityController.list)
router.get('/oppurtunity/:id', oppurtunityController.show)
router.put('/oppurtunity/:id', oppurtunityController.update)
router.delete('/oppurtunity/:id', oppurtunityController.delete)

module.exports = router

