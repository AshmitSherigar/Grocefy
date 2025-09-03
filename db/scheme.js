const mongoose = require("mongoose")
const { Schema, model } = mongoose

const UserSchema = new Schema({
    username: { type: String, required: true, trim: true, unique: true },
    email: {
        type: String, required: true, lowercase: true, trim: true, match:
            [/.+\@.+\..+/, "Please Enter Valid Email"], unique: true
    },
    password: { type: String, required: true },
})
const AdminSchema = new Schema({
    username: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true }
})
const recipeSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    ingredients: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            unit: String
        }
    ],
    steps: [
        {
            order: { type: Number, required: true },
            instruction: { type: String, required: true },
            time: { type: Number }
        }
    ],
    prepTime: { type: Number, required: true },
    cookTime: { type: Number, required: true },
    servings: { type: Number, required: true },
    visibility: { type: String, enum: ["public", "private"], default: "private" },
    shareToken: { type: String, unique: true, sparse: true, select: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

})
const User = model("User", UserSchema)
const Admin = model("Admin", AdminSchema)
const Recipe = model("Recipe", recipeSchema)

module.exports = {
    User,
    Admin,
    Recipe
}



