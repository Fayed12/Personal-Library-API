// local
const Book = require("../../schemas/models/bookModel")

const deleteAll = async (req, res) => {
    const confirm = req.query.confirm === "true"

    if (!confirm) {
        return res.status(400).json({
            status: "failed",
            message: "actions denied because you not confirm the delete all action"
        })
    }

    try {
        const result = await Book.deleteMany({})

        if (result.deletedCount === 0) {
            return res.status(404).json({
                status: "failed",
                message: "process is failed, nothing deleted, it might be there is not data found"
            })
        }

        res.status(204).send()
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}


module.exports = deleteAll