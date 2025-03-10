const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, required: true }, // ✅ Store Google ID
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
    },
    image:{
        type: String
    }
})

const UserModel = mongoose.model('User',UserSchema)
module.exports = UserModel