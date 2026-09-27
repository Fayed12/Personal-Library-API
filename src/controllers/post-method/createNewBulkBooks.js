// local
const Book = require("../../schemas/models/bookModel");

const createBulkBooks = async (req, res) => {
    try {
        const reqBody = req.body

        let idExist = false

        reqBody.books.forEach(reqBook => {
            if (reqBook._id) {
                idExist = true
                return
            }
        });

        if (idExist) {
            return res.status(400).json({
                status: "failed",
                message: "you not allowed to send id with your object!"
            })
        }

        const books = await Book.insertMany(reqBody.books)

        res.status(201).json({
            status: "success",
            message: {
                data: books
            }
        })

    } catch (error) {
        return res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}

module.exports = createBulkBooks