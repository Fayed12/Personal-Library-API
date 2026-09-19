// 3rd library
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const path = require("path")

const app = express()

app.use(cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"]
}))

// Configure Helmet with proper Content Security Policy for fonts & scripts
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"]
        }
    }
}))

// Body parser
app.use(express.json())

// Serve static assets from the welcome-page directory
const welcomePath = path.join(__dirname, "components", "welcome-page")
app.use(express.static(welcomePath))
app.use("/components", express.static(path.join(__dirname, "components")))

// System health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        service: "Personal Library API",
        message: "Server is online and healthy"
    })
})

module.exports = app