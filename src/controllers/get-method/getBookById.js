// local
const Book = require("../../schemas/models/bookModel");

const getBookById = async (req, res) => {
    const id = (req.params.id).trim()

    try {
        const book = await Book.findById(id)

        if (Object.keys(book).length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "No data found!"
            });
        }

        res.status(200).json({
            status: "success",
            data: book
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: "Something went wrong while fetching books"
        });
    }
}

module.exports = getBookById