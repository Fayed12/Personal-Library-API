// local
const booksData = require("../../services/readAllBooks")

// node
const fs = require("node:fs")

const updateCategory = (req, res) => {
    const { from, to } = req.body

    if (!from && !to) {
        return res.status(400).json({
            status: "failed",
            message: " please insert from and to data object"
        })
    }

    const books = booksData.filter(book => {
        return book.category.trim().toLowerCase() === from.trim().toLowerCase()
    })

    if (books.length <= 0) {
        return res.status(404).json({
            status: "failed",
            message: "no data founded"
        })
    }

    books.forEach(book => {
        Object.assign(book, { category: to })
    });

    
    fs.writeFile(`${__dirname}/../../../booksData.json`, JSON.stringify(booksData), (err) => {
        if (err) {
            res.status(404).json({
                status: "failed",
                message: "something went wrong!"
            })
        } else {
            res.status(200).json({
                status: "success",
                message: {
                    data: books
                }
            })
        }
    })
}

module.exports = updateCategory