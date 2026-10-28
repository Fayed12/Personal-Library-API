// local
const Book = require("../../schemas/models/bookModel");

const getAllStats = async (req, res, next) => {
    try {
        const result = await Book.aggregate([
            {
                $group: {
                    _id: null,
                    totalBooks: { $sum: 1 },
                    totalPages: { $sum: "$pages" },
                    averagePages: { $avg: "$pages" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalBooks: 1,
                    totalPages: 1,
                    averagePages: { $round: ["$averagePages", 2] }
                }
            },
            {
                $sort: {
                    totalPages: -1,
                    averagePages: -1,
                    _id: 1
                }
            }
        ])

        res.status(200).json({
            status: "success",
            data: result
        });
    } catch (err) {
        next(err)
    }
}

module.exports = getAllStats