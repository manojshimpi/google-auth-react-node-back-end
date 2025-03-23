const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: { 
        type: String, 
        unique: true, 
        required: false // No longer required for normal users
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    password: {
        type: String,
        validate: {
            validator: function(value) {
                // Password is required only if there is no googleId
                if (!this.googleId) {
                    return value && value.length >= 6; // Must be at least 6 characters
                }
                return true; // No validation needed if googleId is present
            },
            message: 'Password must be at least 6 characters long'
        }
    },
    type: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
