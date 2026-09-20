// local
const checkAllowedFields = require("../../services/checkAllowedFields")
const booksData = require("../../services/readAllBooks")

// node
const fs = require("node:fs")

const updateBook = (req, res) => {
    const id = req.params.id
    const reqBody = req.body

    const book = booksData.find((book => book.id === id.trim()))

    const isSameRating = book.rating === reqBody?.rating
    const isSameTitle = book.title.trim().toLowerCase() === reqBody?.title?.trim().toLowerCase()
    const isSameAuthor = book.author.trim().toLowerCase() === reqBody?.author?.trim().toLowerCase()
    const isSameCategory = book.category.trim().toLowerCase() === reqBody?.category?.trim().toLowerCase()
    const isSamePages = book.pages === reqBody?.pages
    const isSamePagesRead = book.pagesRead === reqBody?.pagesRead
    const isSameCurrentPage = book.currentPage === reqBody?.currentPage
    const isSamePublishedYear = book.publishedYear === reqBody?.publishedYear
    const isSameStatus = book.status === reqBody?.status

    if (isSameRating) {
        return res.status(409).json({
            status: "failed",
            message: "this rating is already exist"
        })
    }

    if (isSameTitle) {
        return res.status(409).json({
            status: "failed",
            message: "this title is already exist"
        })
    }

    if (isSameAuthor) {
        return res.status(409).json({
            status: "failed",
            message: "this author name is already exist"
        })
    }

    if (isSameCategory) {
        return res.status(409).json({
            status: "failed",
            message: "this category is already exist"
        })
    }

    if (isSamePages) {
        return res.status(409).json({
            status: "failed",
            message: "this pages value is already exist"
        })
    }

    if (isSamePagesRead) {
        return res.status(409).json({
            status: "failed",
            message: "this pages read value is already exist"
        })
    }

    if (isSameCurrentPage) {
        return res.status(409).json({
            status: "failed",
            message: "this currant page value is already exist"
        })
    }

    if (isSamePublishedYear) {
        return res.status(409).json({
            status: "failed",
            message: "this Published Year value is already exist"
        })
    }

    if (isSameStatus) {
        return res.status(409).json({
            status: "failed",
            message: "this status value is already exist"
        })
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

module.exports = updateBook