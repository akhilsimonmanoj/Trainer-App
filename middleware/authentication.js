const jwt = require('jsonwebtoken')
const User = require('../models/User')
const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1]
    let tokenData 
    try {
        tokenData = jwt.verify(token, 'akhil123')
        User.findById(tokenData._id)
            .then((user) => {
                req.user = user 
                next()
            })
            .catch((err) => {
                res.status(401).json(err)
            })
       
    } catch(e) {
        res.status(401).json(e.message)
    }
}


module.exports = {
    authenticateUser
}