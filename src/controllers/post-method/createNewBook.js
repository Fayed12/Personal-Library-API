// local
const booksData = require("../../services/readAllBooks")

// node
const fs = require("node:fs")

const createNewBook = (req, res) => {
    const reqBody = req.body

    if (reqBody.id) {
        return res.status(400).json({
            status: "failed",
            message: "you not allowed to send id with your object!"
        })
    }

    if (!reqBody.title || !reqBody.author || !reqBody.category || !reqBody.pages || !reqBody.publishedYear) {
        return res.status(400).json({
            status: "failed",
            message: "please fill in all Required data, object must contain {title, author, category, pages, publishedYear} and can add all Optional too !"
        })
    }

    const checkIfExist = booksData.find((book) => book.title.trim().toLowerCase() === reqBody.title.trim().toLowerCase())

    if (checkIfExist) {
        return res.status(409).json({
            status: "failed",
            message: `book with name "${checkIfExist.title}" is exist try another one please!`
        })
    }

    if (
        (reqBody.pages !== undefined && typeof reqBody.pages !== "number") ||
        (reqBody.pagesRead !== undefined && typeof reqBody.pagesRead !== "number") ||
        (reqBody.currentPage !== undefined && typeof reqBody.currentPage !== "number") ||
        (reqBody.rating !== undefined && typeof reqBody.rating !== "number")
    ) {
        return res.status(400).json({
            status: "failed",
            message: "pages, pagesRead, currentPage and rating must be numbers!"
        });
    }

    if (!["planned", "completed", "reading"].includes(reqBody?.status)) {
        return res.status(400).json({
            status: "failed",
            message: `the status values are allowed are [planned, reading, completed] !`
        })
    }

    const newBook = {
        id: crypto.randomUUID(),
        title: "",
        author: "",
        category: "",
        pages: 0,
        pagesRead: 0,
        currentPage: 0,
        rating: 0,
        status: "planned",
        publishedYear: "",
        tags: [],
        addedAt: new Date().toISOString()
    }

    Object.assign(newBook, reqBody)
    booksData.push(newBook)

    fs.writeFile(`${__dirname}/../../../booksData.json`, JSON.stringify(booksData), (err) => {
        if (err) {
            res.status(404).json({
                status: "failed",
                message: "something went wrong!"
            })
        } else {
            res.status(201).json({
                status: "success",
                location: `get /api/books/${newBook.id}`,
                message: {
                    data: booksData
                }
            })
        }
    })
}

module.exports = createNewBook