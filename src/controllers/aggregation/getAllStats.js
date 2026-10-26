// local
const Book = require("../../schemas/models/bookModel");

const getAllStats = async (req, res) => {
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
                    averagePages:-1,
                    _id: 1
                }
            }
        ])

        if (result.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "No data found!"
            });
        }

        res.status(200).json({
            status: "success",
            data: result
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: "Something went wrong while fetching books"
        });
    }
}

module.exports = getAllStats