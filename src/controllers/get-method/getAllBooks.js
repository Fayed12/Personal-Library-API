// local
const Book = require("../../schemas/models/bookModel")

const getAllBooks = async (req, res) => {
    const { category, status, author, notStatus, fields, sort, page, limit } = req.query

    const defaultLimit = 5;
    const defaultPage = 1;
    const maxLimit = 20;
    let paginationLimit = defaultLimit;
    let skipPagination = 0

    let projection = ""
    let sortObject = {}
    let filter = {}
    if (category) filter.category = {
        $regex: category.trim(),
        $options: "i"
    }
    if (status) filter.status = {
        $regex: status.trim(),
        $options: "i"
    }
    if (author) filter.author = {
        $regex: author.trim(),
        $options: "i"
    }
    if (notStatus) filter.status = {
        $not: {
            $regex: `^${notStatus.trim()}$`,
            $options: "i"
        }
    }

    if (fields) {
        const fieldsToArray = fields?.split(",")
        const allowedFieldsProjection = [
            "title",
            "author",
            "category",
            "pages",
            "pagesRead",
            "rating",
            "status",
            "publishedYear",
            "tags",
            "createdAt",
            "updatedAt"
        ];

        const isValid = fieldsToArray.every((filed) => {
            return allowedFieldsProjection.includes(filed)
        })

        if (!isValid) {
            return res.status(400).json({
                message: "Invalid fields requested"
            });
        }

        projection = fieldsToArray.join(" ")
    }

    if (sort) {
        const sortToArray = sort.split(",")

        const allowedFieldsSort = [
            "title",
            "author",
            "pages",
            "rating",
            "publishedYear",
            "createdAt",
        ];

        const isValid = sortToArray.every((filed) => {

            return allowedFieldsSort.includes(
                filed.startsWith("-") ?
                    filed.slice(1) :
                    filed
            )
        })

        if (!isValid) {
            return res.status(400).json({
                message: "Invalid fields requested"
            });
        }

        sortToArray.forEach((filed) => {
            const isDescending = filed.startsWith("-")

            const filedName = isDescending ? filed.slice(1) : filed

            sortObject[filedName] = isDescending ? -1 : 1
        })
    }

    if (limit || page) {
        const limitNumber = limit ? Number(limit) : defaultLimit
        const pageNumber = page ? Number(page) : defaultPage

        if (Number.isNaN(limitNumber) || Number.isNaN(pageNumber)) {
            return res.status(400).json({
                status: "failed",
                message: "page or limit must be numbers"
            })
        }

        if (limitNumber <= 0 || pageNumber <= 0) {
            return res.status(400).json({
                status: "failed",
                message: "page or limit must be greater than 0"
            })
        }

        paginationLimit = limitNumber ? limitNumber > 20 ? maxLimit : limitNumber : defaultLimit
        skipPagination = pageNumber ? ((pageNumber - 1) * paginationLimit) : ((defaultPage - 1) * paginationLimit)

        if (!sort) {
            sortObject = { createdAt: -1 }
        }
        projection = projection ? `${projection} createdAt` : "createdAt"
    }

    const books = await Book.find(filter).select(projection).sort(sortObject).skip(skipPagination).limit(paginationLimit)

    if (books.length <= 0) {
        return res.status(404).json({
            status: "failed",
            message: "no data founded, or your pagination is not exist in database!"
        })
    }

    res.status(200).json({
        status: "success",
        data: books
    })
}

module.exports = getAllBooks