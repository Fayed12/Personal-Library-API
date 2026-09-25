// local
const bookSchema = require("../bookSchema")

// mongoose
const mongoose = require("mongoose")

const Book = mongoose.model("Book", bookSchema)

module.exports = Book