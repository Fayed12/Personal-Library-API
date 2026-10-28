// local
const Book = require("../../schemas/models/bookModel")

const getCountFilter = async (req, res,next) => {
    const reqQuery = req.query

    const filter = {}

    for (const [key, value] of Object.entries(reqQuery)) {
        filter[key] = {
            $regex: value,
            $options: "i"
        }
    }

    try {
        const count = await Book.aggregate([
            {
                $match: filter
            },
            {
                $count: "total"
            }
        ])

        res.status(200).json({
            status: "success",
            data: count
        });
    } catch (err) {
        next(err)
    }
}

module.exports = getCountFilter