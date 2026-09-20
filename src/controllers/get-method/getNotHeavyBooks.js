// local
const booksData = require("../../services/readAllBooks")

const getNotHeavyBooks = (req, res) => {
    const reqQuery = req.query

    let results = booksData

    if (reqQuery.maxPages) {
        if (reqQuery.maxPages <= 0) {
            return res.status(400).json({
                status: "failed",
                data: "number must be greater than 0"
            })
        }

        results = results.filter(book => book.pages <= reqQuery.maxPages)
    }

    if (results.length <= 0) {
        return res.status(404).json({
            status: "failed",
            data: "no data found"
        })
    }

    res.status(200).json({
        status: "success",
        count:results.length,
        data: results
    })
}

module.exports = getNotHeavyBooks