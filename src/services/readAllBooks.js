// node
const fs = require("node:fs")

const booksData = JSON.parse(fs.readFileSync(`${__dirname}/../../booksData.json`, "utf-8"))


module.exports = booksData