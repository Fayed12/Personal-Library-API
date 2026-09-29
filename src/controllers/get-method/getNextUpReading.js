// local
const Book = require("../../schemas/models/bookModel")

const getNextUpBooks =async (req, res) => {
    const maxPagesNumber = 350

    try {
        const books = await Book.find({
            $or: [
                { $and: [{ $expr: { $lte: ["$pages", maxPagesNumber] } }, { status: "planned" }] },
                { status: "reading" }
            ]
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

module.exports = getNextUpBooks