// local
const Book = require("../../schemas/models/bookModel");

const getStatsByStatus = async (req, res) => {
    try {
        const result = await Book.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalPages: { $sum: "$pages" },
                    totalPagesRead: { $sum: "$pagesRead" },
                    books: {
                        $addToSet: {
                            _id: "$_id",
                            title: "$title",
                            author: "$author",
                            createdAt: "$createdAt"
                        }
                    }
                }
            },
            {
                $addFields: {
                    status: "$_id"
                }
            },
            {
                $project: {
                    _id: 0,
                }
            },
            {
                $sort: {
                    totalPages: -1,
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
            count: result.length,
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

module.exports = getStatsByStatus