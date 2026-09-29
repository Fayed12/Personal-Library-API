// local
const Book = require("../../schemas/models/bookModel")

const getMustReadsBooks =async (req, res) => {
    const rate = 4.5

    try {
        const books = await Book.find({
            $expr: { $gte: ["$rating", rate] },
            status: "completed"
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

module.exports = getMustReadsBooks