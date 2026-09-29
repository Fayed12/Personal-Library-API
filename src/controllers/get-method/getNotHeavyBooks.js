// local
const Book = require("../../schemas/models/bookModel");

const getNotHeavyBooks =async (req, res) => {
    const reqQuery = req.query
    const defaultMaxPages = 400

    let limit = defaultMaxPages;
    const reqPagesNumber = Number(reqQuery.maxPages)

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

        limit = reqPagesNumber
    }

    try {
        const books = await Book.find({ pages: { $lte: limit } })

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

module.exports = getNotHeavyBooks