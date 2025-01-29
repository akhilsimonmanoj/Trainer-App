const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Register a new user
exports.register = async (req, res) => {
    try {
        const body = req.body
        const existingUser = await User.findOne({ email: body.email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' })
        }

        const user = new User(body)
        await user.save()
        res.status(201).json({ message: 'User registered successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Login a user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const isMatch = await user.isValidPassword(password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get current user profile
exports.getProfile = (req, res) => {
    res.json(req.user)
}
