// //local
// const Book = require("../schemas/models/bookModel")

// async function getData() {
//     const books = await Book.find()
    
//     return books
// }

// module.exports = getData

// node
const fs = require("node:fs")

const booksData = JSON.parse(fs.readFileSync(`${__dirname}/../../booksData.json`, "utf-8"))


module.exports = booksData