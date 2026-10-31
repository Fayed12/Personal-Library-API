// mongoose
const mongoose = require("mongoose")

const port = process.env.PORT || 4000
let server;
let isShuttingDown = false
let exitCode = 1

const gracefulShutdown = async (err, code) => {
    // 1- handle the flag value 
    if (isShuttingDown) return
    isShuttingDown = true

    exitCode = code;

    // 2- print error to show the problem
    console.error(err)

    // 3- create close database function
    async function closeDatabase() {
        try {
            await mongoose.disconnect()
        } catch (error) {
            exitCode = 1
        }
        process.exitCode = exitCode
    }

    // 4- start to close the main server if exist then close the mongoose connect if exist then close the main process
    if (server) {
        server.close(async (error) => {
            if (error) {
                console.error("Server close error:", error)
                exitCode = 1
            }

            await closeDatabase()
        })
    } else {
        closeDatabase()
    }
}

// handel promise rejection
process.on("unhandledRejection", async (err) => {
    console.log("shutting down the program unhandled rejection:")
    console.log(err)

    await gracefulShutdown(err, 1)
})

// handel uncaught exception
process.on("uncaughtException", async (err) => {
    console.log("shutting down the program uncaught exception:")
    console.log(err)

    await gracefulShutdown(err, 1)
})

// local
const connectToMongoose = require("./src/services/connectToMongoose")
const app = require("./src/app")

const startServer = async () => {
    try {
        await connectToMongoose()

        server = app.listen(port, () => {
            console.log(`app is running on port ${port}...`)
        })
    } catch (error) {
        console.error("Failed to start server:", error)

        // close mongoose only because the server is not running yet
        await mongoose.disconnect().catch(() => { })

        process.exit(1)
    }
}

startServer()