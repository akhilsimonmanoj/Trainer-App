const Trainer = require('../models/Trainer')
const User = require('../models/User')

exports.getAllTrainers = (req, res) => {
    Trainer.find()
        .populate('user')
        .then((trainers) => res.json(trainers))
        .catch((err) => res.status(500).json({ message: err.message }))
}

exports.addTrainer = async (req, res) => {
    try {
        const { name, email, expertise, contactInfo } = req.body;

        // Check if a user account already exists for this email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create a corresponding User account with default password
        const defaultPassword = 'password123'; // You can generate a random password here
        const user = new User({ name, email, password: defaultPassword, role: 'Trainer' });
        await user.save();

        // Create a new Trainer and associate the user
        const trainer = new Trainer({
            name,
            expertise,
            availability: true,
            contactInfo,
            user: user._id,
        });

        await trainer.save();

        // Populate the user field in the Trainer object
        const populatedTrainer = await Trainer.findById(trainer._id).populate('user');

        // Respond with the created trainer
        res.status(201).json({
            message: 'Trainer and user account created successfully',
            trainer: populatedTrainer,
        });
    } catch (error) {
        console.error('Error adding trainer:', error);
        res.status(500).json({ message: error.message });
    }
};


exports.updateTrainer = (req, res) => {
    Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user')
        .then((trainer) => res.json(trainer))
        .catch((err) => res.status(400).json({ message: err.message }))
}

exports.deleteTrainer = (req, res) => {
    Trainer.findByIdAndDelete(req.params.id).populate('user')
        .then(() => res.status(204).json('Trainer deleted'))
        .catch((err) => res.status(400).json({ message: err.message }))
}
