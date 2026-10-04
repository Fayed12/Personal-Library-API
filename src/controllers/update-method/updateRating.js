// local
const Book = require("../../schemas/models/bookModel")
const checkAllowedFields = require("../../services/checkAllowedFields")

const updateRating = async (req, res) => {
    const id = req.params.id
    const reqBody = req.body

    if (reqBody.rating === undefined) {
        return res.status(400).json({
            status: "failed",
            message: "please insert the new rating value!"
        })
    }

    if (!checkAllowedFields(reqBody, ["rating"])) {
        return res.status(400).json({
            status: "failed",
            message: "only rating is allowed to update"
        })
    }

    if (Number(reqBody.rating) > 5 || Number(reqBody.rating) < 0) {
        return res.status(400).json({
            status: "failed",
            message: "rating must be between 0 and 5"
        })
    }

    try {
        const book = await Book.findById(id)
        const isSameRating = Number(book.rating) === Number(reqBody.rating)

        if (isSameRating) {
            return res.status(404).json({
                status: "failed",
                message: "this value is already exist"
            })
        }

        const newBook = await Book.findByIdAndUpdate(id, reqBody,
            {
                returnDocument: "after",
                runValidators: true
            })

        res.status(200).json({
            status: "success",
            location: `get /api/books/${newBook._id}`,
            message: {
                data: newBook
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

module.exports = updateRating