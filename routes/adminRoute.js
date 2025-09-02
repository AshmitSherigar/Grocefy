const express = require("express")
const router = express.Router()
const { Admin } = require("../db/scheme")
const JWT_SECRET = process.env.JWT_SECRET
const jwt = require("jsonwebtoken")

// Admin Route
router.post("/auth/register", (req, res) => {
    const { username, password } = req.body
    Admin.create({ username, password })
        .then(() => {
            res.status(200).json({ message: "Admin has been created" })
        })
        .catch((err) => {
            res.status(400).json({ message: "Admin cannot be created", error: err.message })
        })
})
router.post("/auth/login", (req, res) => {
    const { username, password } = req.body
    Admin.findOne({ username })
        .then((admin) => {
            const isMatch = admin.password === password
            if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" })
            const token = jwt.sign({ uid: admin._id, username }, JWT_SECRET)
            res.status(200).json({ token, admin: { id: admin._id, username } })
        }).catch(() => {
            res.status(400).json({ message: "Admin not found" })
        })
})

module.exports = router