// local
const Book = require("../../schemas/models/bookModel")

const deleteBulk = async (req, res) => {
    const { ids, status, category, maxRating } = req.query

    if (!ids && !status && !category && maxRating === undefined) {
        return res.status(400).json({
            status: "failed",
            message: "please provide at least one filter: [ids, maxRating, category, status]"
        });
    }

    const filter = {};

    if (ids) {
        const idsArray = ids
            .split(",")
            .map(id => id.trim())
            .filter(Boolean);

        if (idsArray.length > 20) {
            return res.status(400).json({
                status: "failed",
                message: "you can add ids up to 20"
            });
        }

        filter._id = { $in: idsArray };
    }

    if (status) {
        filter.status = status;
    }

    if (category) {
        filter.category = category;
    }

    if (maxRating !== undefined) {
        filter.rating = {
            $lte: maxRating
        };
    }

    try {
        const result = await Book.deleteMany(filter)

        if (result.deletedCount === 0) {
            return res.status(404).json({
                status: "failed",
                message: "process is failed nothing deleted, check your ids"
            })
        }

        res.sendStatus(204)
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

module.exports = deleteBulk