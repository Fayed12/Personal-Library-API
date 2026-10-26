// local
const Book = require("../../schemas/models/bookModel")

const getStatsByCategory = async (req, res) => {
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
                $match: filter
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    totalPages: { $sum: "$pages" },
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

module.exports = getStatsByCategory