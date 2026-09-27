// local
const app = require("./src/app")
const connectToMongoose = require("./src/services/connectToMongoose")

const port = process.env.PORT || 4000

connectToMongoose()

app.listen(port, () => {
    console.log(`app is running on port ${port}...`)
})