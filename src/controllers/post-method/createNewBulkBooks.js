// local
const Book = require("../../schemas/models/bookModel");
const createErrorObject = require("../../services/errorObject");

const createBulkBooks = async (req, res, next) => {
    try {
        const reqBody = req.body

        let idExist = false

        reqBody.books.forEach(reqBook => {
            if (reqBody._id || reqBody.id) {
                idExist = true
                return
            }
        });

        if (idExist) {
            const err = createErrorObject("you not allowed to send id with your object!", "failed", 400, true)
            throw err
        }

        const books = await Book.insertMany(reqBody.books)

        res.status(201).json({
            status: "success",
            message: {
                data: books
            }
        })

    } catch (err) {
        next(err)
    }
}

module.exports = createBulkBooks