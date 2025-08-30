const express = require("express")
const mongoose = require("mongoose")
const userRoutes = require("./routes/userRoute")
const adminRoutes = require("./routes/adminRoute")
const app = express()
const PORT = 5000

app.use(express.json())
mongoose.connect("mongodb://localhost:27017/grocefy")

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


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})