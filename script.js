require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const userRoutes = require("./routes/userRoute")
const adminRoutes = require("./routes/adminRoute")
const authMiddleware = require("./middleware/authMiddleare")
const { v4: uuidv4 } = require("uuid")
const app = express()

const PORT = process.env.PORT || 5000
const MONGO_URL = process.env.MONGO_URL;

const { Recipe, Admin } = require("./db/scheme")

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
//Recipe Route
app.get("/recipe", (_, res) => {
    Recipe.find({ visibility: "public" }).populate("owner", "username email")
        .then((publicRecipe) => {
            res.status(200).json(publicRecipe)
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


app.put("/recipe/:id", authMiddleware, (req, res) => {

    const { id } = req.params
    const userId = req.user.id
    const updates = req.body


    Admin.findOne({ _id: userId })
        .then((isAdmin) => {
            if (!isAdmin) {
                Recipe.findOneAndUpdate(
                    { _id: id, owner: userId },
                    { $set: updates },
                    { new: true, upsert: false }
                )
                    .then((updatedRecipe) => {
                        if (!updatedRecipe) {
                            return res.status(400).json({ message: "No such recipes available under your username" })
                        }

                        res.status(200).json(updatedRecipe)

                    })
                    .catch((err) => {

                        res.json({ message: "Server Error", error: err.message })

                    })
            } else {
                Recipe.findOneAndUpdate(
                    { _id: id },
                    { $set: updates },
                    { new: true }
                )
                    .then((updatedRecipe) => {

                        if (!updatedRecipe) {
                            return res.status(400).json({ message: "No such recipes available" })
                        }

                        res.status(200).json(updatedRecipe)

                    })
                    .catch((err) => {

                        res.json({ message: "Server Error", error: err.message })

                    })

            }

        })






})
app.delete("/recipe/:id", authMiddleware, (req, res) => {

    const { id } = req.params

    const userId = req.user.id

    Admin.findOne({ _id: userId })
        .then((isAdmin) => {
            if (!isAdmin) {

                Recipe.deleteOne({ _id: id, owner: userId })
                    .then((deletedRecipe) => {
                        if (!deletedRecipe) {

                            return res.status(400).json({ message: "No such recipes available under your username" })


                        }
                        res.status(200).json(deletedRecipe)
                    })
                    .catch((err) => {

                        res.status(400).json({ message: "Server Error", error: err.message })
                    })
            } else {

                Recipe.deleteOne({ _id: id })
                    .then((deletedRecipe) => {
                        if (!deletedRecipe) {

                            return res.status(400).json({ message: "No such recipes available to delete" })


                        }
                        res.status(200).json(deletedRecipe)
                    })
                    .catch((err) => {

                        res.status(400).json({ message: "Server Error", error: err.message })
                    })

            }
        })

})
app.get("/recipe/:id/share", authMiddleware, (req, res) => {

    const { id } = req.params;
    const userId = req.user.id;

    Recipe.findOne({ _id: id, owner: userId }).select("+shareToken")
        .then(async (recipe) => {
            if (!recipe) return res.status(404).json({ message: "Recipe not found or not owned by you" })

            if (!recipe.shareToken) {
                recipe.shareToken = uuidv4();
                await recipe.save();
            }
            const shareLink = `http://localhost:5000/share/${recipe.shareToken}`;
            res.json({ shareLink });
        })
        .catch((err) => {
            res.status(500).json({ message: "Server error", error: err.message });
        });



})
app.get("/recipe/share/:token", (req, res) => {

    const { token } = req.params;

    Recipe.findOne({ shareToken: token }).select("+shareToken").populate("owner", 'username email')
        .then(async (recipe) => {
            if (!recipe) return res.status(404).json({ message: "Invalid Link" })
            res.json({
                title: recipe.title,
                description: recipe.description,
                ingredients: recipe.ingredients,
                steps: recipe.steps,
                owner: recipe.owner.username
            });
        })
        .catch((err) => {
            res.status(500).json({ message: "Server error", error: err.message });
        });



})
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})