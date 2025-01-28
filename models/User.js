const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    role: {
        type: String,
        enum: ['admin', 'trainer'],
        default: 'admin'
    }
}, {timestamps: true})

userSchema.pre('save', function(next) {
    const user = this; // 'this' will now refer to the user document
    if (!user.isModified('password')) return next(); // Only hash the password if it's new or modified

    bcrypt.genSalt()
        .then((salt) => {
            bcrypt.hash(user.password, salt)
                .then((encrypted) => {
                    user.password = encrypted;
                    next();
                })
                .catch((err) => {
                    next(err); // Pass errors to next middleware
                });
        })
        .catch((err) => {
            next(err); // Pass errors to next middleware
        });
});


const User = mongoose.model('User', userSchema)
module.exports = User