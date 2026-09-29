// local
const Book = require("../../schemas/models/bookModel")

const getTopRatedBooks = async (req, res) => {
    const reqQuery = req.query
    let defaultLimit = 5
    let MaxLimit = 10

    const reqPagesNumber = Number(reqQuery.limit)

    if (typeof reqPagesNumber !== "number") {
        return res.status(400).json({
            status: "failed",
            data: "the limit must be number"
        })
    }

    if (reqPagesNumber) {
        if (reqPagesNumber <= 0) {
            return res.status(400).json({
                status: "failed",
                data: "number must be greater than 0"
            })
        }

        if (reqPagesNumber > 10) {
            defaultLimit = MaxLimit
        }

        defaultLimit = reqPagesNumber
    }

    try {
        const books = await Book.find({ rating: { $gt: 0 } }).sort({ rating: -1 }).limit(defaultLimit)

        if (books.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "No data found!"
            });
        }

        res.status(200).json({
            status: "success",
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: "Something went wrong while fetching books"
        });
    }
}

module.exports = getTopRatedBooks