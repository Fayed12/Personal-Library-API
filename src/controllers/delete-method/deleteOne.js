// local
const Book = require("../../schemas/models/bookModel")

const deleteOne = async (req, res) => {
    const { id } = req.params

    try {

        const book = await Book.findByIdAndDelete(id, {
            projection: {
                title: 1,
                author: 1,
                pages: 1,
                status: 1,
            }
        })

        res.status(200).json({
            status: "success",
            message: {
                data: book
            }
        })

    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

module.exports = deleteOne