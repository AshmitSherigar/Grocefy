require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const userRoutes = require("./routes/userRoute")
const adminRoutes = require("./routes/adminRoute")
const recipeRoutes = require("./routes/recipeRoute")
const app = express()

const PORT = process.env.PORT || 5000
const MONGO_URL = process.env.MONGO_URL;


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
app.use("/recipe", recipeRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})