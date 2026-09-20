// local
const checkAllowedFields = require("../../services/checkAllowedFields")
const booksData = require("../../services/readAllBooks")

// node
const fs = require("node:fs")

const updateAllBook = (req, res) => {
    const id = req.params.id
    const reqBody = req.body

    const book = booksData.find((book => book.id === id.trim()))

    if (
        reqBody.title === undefined ||
        reqBody.author === undefined ||
        reqBody.category === undefined ||
        reqBody.pages === undefined ||
        reqBody.pagesRead === undefined ||
        reqBody.currentPage === undefined ||
        reqBody.rating === undefined ||
        reqBody.status === undefined ||
        reqBody.publishedYear === undefined ||
        reqBody.tags === undefined
    ) {
        return res.status(400).json({
            status: "failed",
            message: "you must put all book object",
            currentBook: book
        });
    }

    Object.assign(book, reqBody)

    fs.writeFile(`${__dirname}/../../../booksData.json`, JSON.stringify(booksData), (err) => {
        if (err) {
            res.status(404).json({
                status: "failed",
                message: "something went wrong!"
            })
        } else {
            res.status(200).json({
                status: "success",
                location: `get /api/books/${book.id}`,
                message: {
                    data: book
                }
            })
        }
    })
}

module.exports = updateAllBook