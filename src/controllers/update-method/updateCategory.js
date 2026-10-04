// local
const Book = require("../../schemas/models/bookModel")

const updateCategory = async (req, res) => {
    const { from, to } = req.body

    if (!from && !to) {
        return res.status(400).json({
            status: "failed",
            message: " please insert from and to data object"
        })
    }

    try {
        const result = await Book.updateMany({ category: { $regex: from.trim().toLowerCase(), $options: "i" } }, { $set: { category: to } }, { runValidators: true })
        
        if (result.matchedCount === 0) {
            return res.status(404).json({
                status: "failed",
                message: "No books found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "data updated successfully"
        })
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

module.exports = updateCategory