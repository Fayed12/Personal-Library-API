// local
const Book = require("../../schemas/models/bookModel");

const getByAuthor = async (req, res, next) => {
    const reqQuery = req.query
    const minBooks = reqQuery?.minBooks ? Number(reqQuery.minBooks) : 1

    if (minBooks <= 0) {
        return res.status(400).json({
            status: "failed",
            message: "minBooks must be greater than 0!"
        });
    }

    try {
        const result = await Book.aggregate([
            {
                $group: {
                    _id: "$author",
                    count: { $sum: 1 },
                    totalPages: { $sum: "$pages" }
                }
            },
            {
                $match: {
                    count: { $gte: minBooks }
                }
            },
            {
                $project: {
                    _id: 0,
                    author: "$_id",
                    count: 1,
                    totalPages: 1
                }
            },
            {
                $sort: {
                    count: -1,
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
    } catch (error) {
        next(err)
    }
}

module.exports = getByAuthor