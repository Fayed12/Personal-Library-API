// local
const Book = require("../schemas/models/bookModel")

const getAllBooks = require("../controllers/get-method/getAllBooks")
const getBookByCategory = require("../controllers/get-method/getBookByCategory")
const getBookById = require("../controllers/get-method/getBookById")
const getInconsistentBooks = require("../controllers/get-method/getInconsistentBooks")
const getMustReadsBooks = require("../controllers/get-method/getMustReadsBooks")
const getNextUpBooks = require("../controllers/get-method/getNextUpReading")
const getNotHeavyBooks = require("../controllers/get-method/getNotHeavyBooks")
const getRecentBooks = require("../controllers/get-method/getRecentBooks")
const getTopRatedBooks = require("../controllers/get-method/getTopRated")
const getUnfinishedBooks = require("../controllers/get-method/getUnfinishedBooks")
const getWeekendReads = require("../controllers/get-method/getWeekendReads")

const createNewBook = require("../controllers/post-method/createNewBook")
const createBulkBooks = require("../controllers/post-method/createNewBulkBooks")

const updateRating = require("../controllers/update-method/updateRating")
const updateBook = require("../controllers/update-method/updateBook")
const updateAllBook = require("../controllers/update-method/updateAllBook")
const updateProgress = require("../controllers/update-method/updateProgress")
const updateCategory = require("../controllers/update-method/updateCategory")
const updateTags = require("../controllers/update-method/updateTags")

const deleteOne = require("../controllers/delete-method/deleteOne")
const deleteAll = require("../controllers/delete-method/deleteAll")

const getAllStats = require("../controllers/aggregation/getAllStats")
const getCountFilter = require("../controllers/aggregation/getCountFilter")
const getAvgRating = require("../controllers/aggregation/getAvgRating")
const getStatsByCategory = require("../controllers/aggregation/getStatsByCategory")
const getStatsByStatus = require("../controllers/aggregation/getStatsByStatus")
const getRatingByCategory = require("../controllers/aggregation/getRatingByCategory")

// express
const express = require("express")
const deleteBulk = require("../controllers/delete-method/deleteBulk")

const booksRouter = express.Router()

booksRouter.use(express.json({ strict: true }))

booksRouter.param("id", async (req, res, next, id) => {
    if (!id) {
        return res.status(404).json({
            status: "failed",
            message: "please insert id!"
        })
    }

    const book = await Book.findById(id)

    if (!book || Object.keys(book).length == 0) {
        return res.status(404).json({
            status: "failed",
            message: "this book is not exist!"
        })
    }

    next()
})

// validate fields before start update 
const validateFields = (req, res, next) => {
    const reqBody = req.body

    if (!reqBody) {
        return res.status(400).json({
            status: "failed",
            message: "please start to add fields"
        })
    }

    const isIdExist = Object.keys(reqBody).some((field) => field == "id")
    const isDateExist = Object.keys(reqBody).some((field) => field == "createdAt" || field == "updatedAt")

    if (isIdExist) {
        return res.status(400).json({
            status: "failed",
            message: "id is not allowed to update!"
        })
    }

    if (isDateExist) {
        return res.status(400).json({
            status: "failed",
            message: "addedAt is not allowed to update!"
        })
    }

    if (
        (reqBody.pages !== undefined && typeof reqBody.pages !== "number") ||
        (reqBody.pagesRead !== undefined && typeof reqBody.pagesRead !== "number") ||
        (reqBody.currentPage !== undefined && typeof reqBody.currentPage !== "number") ||
        (reqBody.rating !== undefined && typeof Number(reqBody.rating) !== "number")
    ) {
        return res.status(400).json({
            status: "failed",
            message: "pages, pagesRead, currentPage and rating must be numbers!"
        });
    }

    // if (!{"planned", "completed", "reading"].includes(reqBody?.status)) {
    if (((reqBody.status !== undefined) && (!["planned", "completed", "reading"].includes(reqBody?.status)))) {
        return res.status(400).json({
            status: "failed",
            message: `the status values are allowed are [planned, reading, completed] !`
        })
    }

    next()
}

// create new book
booksRouter.post("/", createNewBook)
booksRouter.post("/bulk", createBulkBooks)

// Aggregation
booksRouter.get("/stats", getAllStats)
booksRouter.get("/stats/count", getCountFilter)
booksRouter.get("/stats/average-rating", getAvgRating)
booksRouter.get("/stats/by-category", getStatsByCategory)
booksRouter.get("/stats/by-status", getStatsByStatus)
booksRouter.get("/stats/ratings-by-category", getRatingByCategory)
booksRouter.get("/stats/by-author", async (req, res) => {
    const reqQuery = req.query
    const minBooks = reqQuery?.minBooks ? Number(reqQuery.minBooks) : 1

    if (minBooks <= 0) {
        return res.status(400).json({
            status: "failed",
            message: "minBooks must be greater than 0!"
        });
    }
    console.log(minBooks)

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
})


// get
booksRouter.get("/", getAllBooks)
booksRouter.get("/category/:category", getBookByCategory)
booksRouter.get("/top-rated", getTopRatedBooks)
booksRouter.get("/recent", getRecentBooks)
booksRouter.get("/must-reads", getMustReadsBooks)
booksRouter.get("/not-heavy", getNotHeavyBooks)
booksRouter.get("/weekend-reads", getWeekendReads)
booksRouter.get("/next-up", getNextUpBooks)
booksRouter.get("/unfinished", getUnfinishedBooks)
booksRouter.get("/inconsistent", getInconsistentBooks)
booksRouter.get("/:id", getBookById)

// update
booksRouter.patch("/:id/tags", updateTags)
booksRouter.patch("/bulk/category", updateCategory)
booksRouter.patch("/:id/rating", updateRating)
booksRouter.patch("/:id/progress", updateProgress)
booksRouter.patch("/:id", validateFields, updateBook)
booksRouter.put("/:id", validateFields, updateAllBook)

// delete
booksRouter.delete("/all", deleteAll)
booksRouter.delete("/bulk", deleteBulk)
booksRouter.delete("/:id", deleteOne)

module.exports = booksRouter