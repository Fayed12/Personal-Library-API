// local
const checkAllowedFields = require("../../services/checkAllowedFields")
const booksData = require("../../services/readAllBooks")

// node
const fs = require("node:fs")

const updateRating = (req, res) => {
    const id = req.params.id
    const reqBody = req.body

    if (!reqBody.rating) {
        return res.status(404).json({
            status: "failed",
            message: "please insert the new rating value!"
        })
    }

    if (!checkAllowedFields(reqBody, ["rating"])) {
        return res.status(404).json({
            status: "failed",
            message: "only rating is allowed to update"
        })
    }

    const book = booksData.find((book => book.id === id.trim()))
    const isSameRating = book.rating === reqBody.rating

    if (isSameRating) {
        return res.status(404).json({
            status: "failed",
            message: "this value is already exist"
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

module.exports = updateRating