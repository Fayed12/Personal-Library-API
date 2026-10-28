// local
const Book = require("../../schemas/models/bookModel");

const getStatsByStatus = async (req, res,next) => {
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

        res.status(200).json({
            status: "success",
            count: result.length,
            data: result
        });
    } catch (err) {
        next(err)
    }
}

module.exports = getStatsByStatus