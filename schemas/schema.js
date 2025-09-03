const { z } = require("zod")

const userSignSchema = z.object({
    username: z.string().min(3, "Username must be minimum 3 characters"),
    email: z.string().email("Invalid Email Format"),
    password: z.string().min(6, "Password must be minimum 6 characters")
})
const adminSignSchema = z.object({
    username: z.string().min(3, "Username must be minimum 3 characters"),
    password: z.string().min(6, "Password must be minimum 6 characters")
})

module.exports = { adminSignSchema, userSignSchema }

