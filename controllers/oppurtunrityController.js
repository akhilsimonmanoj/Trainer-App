const Oppurtunity = require('../models/Oppurtunity')
const oppurtunityController = {}

oppurtunityController.create = async (req, res) => {
    const body = req.body
    try {
        const oppurtunity = await Oppurtunity.create(body)
        return res.json('Oppurtunity Created', oppurtunity)
    } catch (error) {
        return res.json(error.message)
    }
}

oppurtunityController.list = async (req, res) => {
    try {
        const opp = await Oppurtunity.find()
        return res.json('List of Oppurtunities', opp)
    } catch (error) {
        return res.json(error.message)
    }
}

oppurtunityController.show = async (req, res) => {
    try {
        const id = req.params.id
        const opp = await Oppurtunity.findById(id)
        return res.json({Oppurtunity: opp})
    } catch (error) {
        return res.json(error.message)
    }
}

oppurtunityController.update = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body
        let opp = await Oppurtunity.findById(id)
        if(!opp){
            return res.json('Oppurnity not found')
        }
        opp = await Oppurtunity.findByIdAndUpdate(id, body, {new: true, runValidators: true})
        return res.json('Oppurtunity updated', opp)
    } catch (error) {
        return res.json(error.message)
    }
}

oppurtunityController.delete = async (req, res) => {
    try {
        const id = req.params.id
        const opp = await Oppurtunity.findById(id)
        if(!opp){
            return res.json('Oppurtunity not found')
        }
        await opp.remove()
        return res.json('Oppurtunity Deleted')
    } catch (error) {
        return res.json(error.message)
    }
}

oppurtunityController.interest = async (req, res) => {
    const id = req.params.id
    const { trainerId } = req.body
    try {
        const oppurtunity = await Oppurtunity.findById(id)
        if(!oppurtunity){
            return res.json('Oppurtunity not found')
        }

        if(oppurtunity.interestedTrainers.includes(trainerId)){
            res.json('Interest is already expressed')
        }

        oppurtunity.interestedTrainers.push(trainerId)
        await oppurtunity.save()

        return res.json('Interest sent')
    } catch (error) {
        
    }
}

module.exports = oppurtunityController