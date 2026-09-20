// local
const booksData = require("../../services/readAllBooks")

// node
const fs = require("node:fs")

const createBulkBooks = (req, res) => {
    const reqBody = req.body
    let idExist = false
    let dataIsComplete = true
    let bookIsExist = {
        status: false,
        bookName: null
    }
    reqBody.books.forEach(reqBook => {
        if (reqBook.id) {
            idExist = true
            return
        }

        if (!reqBook.title || !reqBook.author || !reqBook.category || !reqBook.pages || !reqBook.publishedYear) {
            dataIsComplete = false
            return
        }

        const checkIfExist = booksData.find((book) => book.title.trim().toLowerCase() === reqBook.title.trim().toLowerCase())

        if (checkIfExist) {
            bookIsExist.status = true
            bookIsExist.bookName = checkIfExist.title
            return
        }
    });

    if (idExist) {
        return res.status(400).json({
            status: "failed",
            message: "you not allowed to send id with your object!"
        })
    }

    if (!dataIsComplete) {
        return res.status(400).json({
            status: "failed",
            message: "please fill in all Required data, object must contain {title, author, category, pages, publishedYear} and can add all Optional too !"
        })
    }

    if (bookIsExist.status) {
        return res.status(409).json({
            status: "failed",
            message: `book with name "${bookIsExist.bookName}" is exist try another one please!`
        })
    }

    const newBooksArray = reqBody.books.map((book) => {
        return {
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
            addedAt: new Date().toISOString(),
            ...book
        };
    });

    booksData.push(...newBooksArray)

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

module.exports = createBulkBooks