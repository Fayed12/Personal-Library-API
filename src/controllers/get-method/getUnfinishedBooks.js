// local
const Book = require("../../schemas/models/bookModel")

const getUnfinishedBooks = async (req, res) => {


    try {
        const books = await Book.find({
            pagesRead: { $gt: 0 },
            $expr: { $lt: ["$pagesRead", "$pages"] }
        })

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

module.exports = getUnfinishedBooks