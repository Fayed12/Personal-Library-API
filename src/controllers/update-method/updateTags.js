// local
const Book = require("../../schemas/models/bookModel")

const updateTags = async (req, res) => {
    const reqBody = req.query
    const { id } = req.params

    if (!reqBody) {
        return res.status(400).json({
            status: "failed",
            message: "please insert your tags"
        });
    }

    try {
        const tags = reqBody?.tags?.split(",").map(tag => tag.trim()).filter(Boolean);
        console.log(tags)

        const book = await Book.findByIdAndUpdate(id, {
            $addToSet:
            {
                tags:
                {
                    $each: tags
                }
            }
        }, { runValidators: true, returnDocument: "after" })

        if (!book) {
            return res.status(404).json({
                status: "failed",
                message: "No book found"
            });
        }

        res.status(200).json({
            status: "success",
            location: `get /api/books/${book._id}`,
            message: book
        })
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

module.exports = updateTags