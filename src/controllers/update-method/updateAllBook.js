// local
const Book = require("../../schemas/models/bookModel")
const checkAllowedFields = require("../../services/checkAllowedFields")

const bookSchema = {
    title: "string",
    author: "string",
    category: "string",
    pages: "number",
    pagesRead: "number",
    currentPage: "number",
    rating: "number",
    status: "reading-completed-planned",
    publishedYear: "number",
}

const updateAllBook = async (req, res) => {
    const id = req.params.id
    const reqBody = req.body

    if (
        reqBody.title === undefined ||
        reqBody.author === undefined ||
        reqBody.category === undefined ||
        reqBody.pages === undefined ||
        reqBody.pagesRead === undefined ||
        reqBody.currentPage === undefined ||
        reqBody.rating === undefined ||
        reqBody.status === undefined ||
        reqBody.publishedYear === undefined
    ) {
        return res.status(400).json({
            status: "failed",
            message: "you must put all book object",
            currentBook: bookSchema
        });
    }

    if (!checkAllowedFields(reqBody, ["rating", "title", "author", "category", "pages", "pagesRead", "currentPage", "publishedYear", "status"])) {
        return res.status(400).json({
            status: "failed",
            message: "there is some values is not allowed to update"
        })
    }

    try {
        const book = await Book.findById(id)

        Object.assign(book, reqBody)

        await book.save()

        res.status(200).json({
            status: "success",
            location: `get /api/books/${book.id}`,
            message: {
                data: book
            }
        })
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

module.exports = updateAllBook