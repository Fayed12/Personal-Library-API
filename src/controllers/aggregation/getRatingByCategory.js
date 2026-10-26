// local
const Book = require("../../schemas/models/bookModel");

const getRatingByCategory = async (req, res) => {
    try {
        const result = await Book.aggregate([
            {
                $group: {
                    _id: "$category",
                    averageRating: { $avg: "$rating" },
                    ratedBooks: { $sum: 1 },
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
                    category: "$_id"
                }
            },
            {
                $project: {
                    _id: 0,
                    averageRating: { $round: ["$averageRating", 2] },
                    ratedBooks: 1,
                    books: 1,
                    category: 1
                }
            },
            {
                $sort: {
                    averageRating: -1,
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

module.exports = getRatingByCategory