const express = require("express")
const router = express.Router()
const { User } = require("../db/scheme")
const JWT_SECRET = "ashmitsecret"
const jwt = require("jsonwebtoken")

// User Routes
router.post("/auth/register", (req, res) => {
    const { username, email, password } = req.body
    User.create({ username, email, password })
        .then(() => {
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

router.post("/auth/login", (req, res) => {
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

module.exports = router