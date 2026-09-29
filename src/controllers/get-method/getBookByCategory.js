// local
const Book = require("../../schemas/models/bookModel")

const getBookByCategory = async (req, res) => {
    const category = req.params.category

    if (!category) {
        return res.status(404).json({
            status: "failed",
            message: "please insert category you want!"
        })
    }

    try {
        const books = await Book.find({ category });

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

module.exports = getBookByCategory