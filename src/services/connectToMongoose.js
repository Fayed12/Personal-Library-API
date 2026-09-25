// mongoose
const mongoose = require("mongoose")

// node
const dns = require("node:dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

const URL = process.env.DATABASE_URL.replace("<db_password>", encodeURIComponent(process.env.PASSWORD))

async function connectToMongoose() {
    try {
        await mongoose.connect(URL)
        console.log("successfully connected to MongoDB....")
        return

    } catch (error) {
        console.log(error)
    }
}

module.exports = connectToMongoose
