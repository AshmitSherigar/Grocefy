const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization
    if (!authHeader) {
        res.status(400).json({ message: "No token available" })
    } else if (!authHeader.startsWith("Bearer ")) {
        res.status(400).json({ message: "Token invalid format" })
    } else {
        const token = authHeader.split(" ")[1]
        try {
            const decoded = jwt.verify(token, JWT_SECRET)
            req.user = { id: decoded.uid };
            next()
        } catch (err) {
            res.status(400).json({ message: "Invalid Token", error: err.message })
        }
    }

}

module.exports = authMiddleware