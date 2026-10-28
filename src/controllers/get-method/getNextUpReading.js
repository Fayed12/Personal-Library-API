// local
const Book = require("../../schemas/models/bookModel")

const getNextUpBooks = async (req, res, next) => {
    const maxPagesNumber = 350

    try {
        const books = await Book.find({
            $or: [
                { $and: [{ $expr: { $lte: ["$pages", maxPagesNumber] } }, { status: "planned" }] },
                { status: "reading" }
            ]
        })

        res.status(200).json({
            status: "success",
            count: books.length,
            data: books
        });
    } catch (err) {
        next(err)
    }
}

module.exports = getNextUpBooks