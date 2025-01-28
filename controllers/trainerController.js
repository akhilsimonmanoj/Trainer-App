const Trainer = require('../models/Trainer')
const trainerController = {}

trainerController.create = async (req, res) => {
    const body = req.body
    try {
        const trainer = await Trainer.create(body)
        return res.status(200).json(trainer) 
    } catch (error) {
        return res.json(error.message)
    }
}

trainerController.list = async (req, res) => {
    try {
        const trainer = await Trainer.find()
        return res.status(200).json({message: 'All Trainers', trainer})
    } catch (error) {
        return res.status(401).json(error.message)
    }
}

trainerController.update = async (req, res) => {
    const id = req.params.id
    const body = req.body
    try {
        let trainer = await Trainer.findById(id)
        if(!trainer){
            return res.json('Trainer not found')
        }
        trainer = await Trainer.findByIdAndUpdate(id, body, {new: true, runValidators: true})
        return res.status(200).json('trainer updated', trainer)
    } catch (error) {
        return res.json(error.message)
    }
}

trainerController.delete = async (req, res) => {
    const id = req.params.id
    try {
        const trainer = await Trainer.findById(id)
        if(!trainer){
            return res.json('Trainer not found')
        }
        await trainer.remove()
        return res.json('Trainer deleted')
    } catch (error) {
        return res.json(error.message)
    }
    
}

module.exports = trainerController