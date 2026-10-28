// local
const Book = require("../../schemas/models/bookModel")

const getAvgRating = async (req, res, next) => {
    const reqQuery = req.query

    const filter = {}

    for (const [key, value] of Object.entries(reqQuery)) {
        filter[key] = {
            $regex: value,
            $options: "i"
        }
    }

    try {
        const result = await Book.aggregate([
            {
                $match: {
                    ...filter,
                    rating: { $gt: 0 }
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    ratedBooks: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    averageRating: { $round: ["$averageRating", 2] },
                    ratedBooks: 1
                }
            },
            {
                $sort: {
                    averageRating: -1,
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

module.exports = getAvgRating