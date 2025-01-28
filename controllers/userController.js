const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userController = {}

userController.register = (req, res) => {
    const body = req.body;
    const user = new User(body);

    user.save()
        .then((user) => {
            res.status(201).json({
                message: 'User successfully added',
                user
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: 'Error registering user',
                error: error.message
            });
        });
};

userController.login = (req, res) => {
    const body = req.body
    User.findOne({email: body.email})
    .then((user) => {
        if(!user){
            res.status(401).json('invalid email or password')
        }
        bcrypt.compare(body.password, user.password)
        .then((match) => {
            if(match){
                const tokenData = {
                    id: user._id,
                    name: user.name,
                    email: user.email,

                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: '1h'})
                res.json({token: token})
            } else {
                res.json('invalid email or password')
            }
        })
    })
}

userController.getAccount = (req, res) => {
    res.json(req.user)
}

module.exports = userController