// local
const booksData = require("../../services/readAllBooks")

// node
const fs = require("node:fs")

const deleteOne = (req, res) => {
    const { id } = req.params
    const selectedBookIndex = booksData.findIndex(book => book.id === id)

    booksData.splice(selectedBookIndex, 1)

    fs.writeFile(`${__dirname}/../../../booksData.json`, JSON.stringify(booksData), (err) => {
        if (err) {
            res.status(404).json({
                status: "failed",
                message: "something went wrong!"
            })
        } else {
            res.status(204).json({
                status: "success",
                message: {
                    data: booksData
                }
            })
        }
    })
}

module.exports = deleteOne