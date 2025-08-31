require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const userRoutes = require("./routes/userRoute")
const adminRoutes = require("./routes/adminRoute")
const authMiddleware = require("./middleware/authMiddleare")
const app = express()

const PORT = process.env.PORT || 5000
const MONGO_URL = process.env.MONGO_URL;

const { Recipe } = require("./db/scheme")

// Middleware
app.use(express.json()) // Parse the body
app.use((req, _, next) => { // Log every request
    console.log(`${req.method} ${req.url}`);
    next()
})

mongoose.connect(`${MONGO_URL}`)

// Test Route
app.get("/", (_, res) => {

    res.json({
        message: "Backend is up and running"
    })

})
// User Route
app.use("/user", userRoutes)
// Admin Route
app.use("/admin", adminRoutes)

app.get("/recipe", (_, res) => {
    Recipe.find({ visibility: "public" }).populate("owner", "username email")
        .then((publicRecipe) => {
            res.status(200).json( publicRecipe )
        })
        .catch((err) => {
            res.status(500).json({ message: "Server Error", error: err.message })
        })



})
app.post("/recipe", authMiddleware, (req, res) => {
    const { title, description, ingredients, steps, prepTime, cookTime, servings, visibility } = req.body
    const { id } = req.user

    Recipe.create({
        title,
        description,
        ingredients,
        steps,
        prepTime,
        cookTime,
        servings,
        visibility,
        owner: id
    }).then(() => {
        res.status(200).json({ message: "Recipe is created" })
    }).catch((err) => {
        res.status(400).json({ message: "Recipe cant be created", error: err.message })
    })



})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})