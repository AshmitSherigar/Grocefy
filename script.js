const express = require("express")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const { User , Admin } = require("./db/scheme")
const app = express()
const PORT = 5000
const JWT_SECRET = "ashmitsecret"


app.use(express.json())
mongoose.connect("mongodb://localhost:27017/grocefy")

app.get("/", (_, res) => {

    res.json({
        message: "Backend is up and running"
    })

})
app.post("user/auth/register", (req, res) => {
    const { username, email, password } = req.body
    User.create({
        username,
        email,
        password
    }).then(() => {
        res.json({
            message: "User has successfully been created"
        })
    }).catch((err) => {
        res.json({
            message: "User cannot be created",
            error: err.message
        })
    })
})
app.post("user/auth/login",  (req, res) => {
    const { email, password } = req.body

    User.findOne({ email })
        .then((user) => {

        
            const isMatch = user.password === password

            if (!isMatch) return res.status(400).json({ error: "Invalid Credential" })

            const token = jwt.sign({ uid: user._id, username: user.name }, JWT_SECRET)

            res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } })

        }).catch(() => {
            res.status(400).json({ message: "User not found" })
        })



})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})