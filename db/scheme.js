const mongoose = require("mongoose")
const { Schema , model } = mongoose

const UserSchema = new Schema({
    username: { type: String, required: true, trim: true },
    email: {
        type: String, required: true, lowercase: true, trim: true, match:
            [/.+\@.+\..+/, "Please Enter Valid Email"]
    },
    password: { type: String, required: true },
})

const User = model("User" , UserSchema)

module.exports = {
    User
}