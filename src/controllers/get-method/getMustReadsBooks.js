// local
const Book = require("../../schemas/models/bookModel")

const getMustReadsBooks = async (req, res, next) => {
    const rate = 4.5

    try {
        const books = await Book.find({
            $expr: { $gte: ["$rating", rate] },
            status: "completed"
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

module.exports = getMustReadsBooks