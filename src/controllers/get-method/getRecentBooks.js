// local
const booksData = require("../../services/readAllBooks")

const getRecentBooks = (req, res) => {
    const reqQuery = req.query
    let defaultLimit = 5
    let MaxLimit = 10

    let results = booksData

    // get recent books by sort it and get the first some books with limit

    if (reqQuery.limit) {

        if (reqQuery.limit <= 0) {
            return res.status(400).json({
                status: "failed",
                data: "number must be greater than 0"
            })
        }

        if (reqQuery.limit > 10) {
            defaultLimit = MaxLimit
        }

        defaultLimit = reqQuery.limit

        results = results.slice(0, defaultLimit)
    }

    if (results.length <= 0) {
        return res.status(404).json({
            status: "failed",
            data: "no data found"
        })
    }

    res.status(200).json({
        status: "success",
        count: results.length,
        data: results
    })
}

module.exports = getRecentBooks