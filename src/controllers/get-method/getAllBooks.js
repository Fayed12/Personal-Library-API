// local
const Book = require("../../schemas/models/bookModel")

const escapeRegex = value => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getAllBooks = async (req, res) => {
    const { category, status, author, notStatus, fields, sort, page, limit, minRating, maxRating, pagesOver, pagesUnder, fromYear, toYear, categories, excludeStatuses, tags } = req.query

    const defaultLimit = 5;
    const defaultPage = 1;
    const maxLimit = 20;
    const currentYear = new Date().getUTCFullYear()
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
    if (notStatus) {
        if (status || excludeStatuses) {
            return res.status(400).json({
                status: "failed",
                message: "you can use only status or excludeStatuses or notStatus not both"
            })
        }

        filter.status = {
            $not: {
                $regex: `^${notStatus.trim()}$`,
                $options: "i"
            }
        }
    }
    if (minRating || maxRating) {
        if ((minRating && Number.isNaN(Number(minRating))) || (maxRating && Number.isNaN(Number(maxRating)))) {
            return res.status(400).json({
                status: "failed",
                message: "minRating or maxRating must be number"
            })
        }

        if (Number(minRating) < 0 || Number(maxRating) < 0 || Number(minRating) > 5 || Number(maxRating) > 5) {
            return res.status(400).json({
                status: "failed",
                message: "invalid rating values, must be from 0 to 5"
            })
        }

        if (

            minRating &&
            maxRating &&
            Number(minRating) >= Number(maxRating)
        ) {
            return res.status(400).json({
                status: "failed",
                message: "minRating must be lower than maxRating"
            })
        }

        filter.rating = minRating ?
            maxRating ? { $gte: Number(minRating), $lte: Number(maxRating) } : { $gte: Number(minRating) }
            :
            { $lte: Number(maxRating) }
    }
    if (pagesOver || pagesUnder) {
        if ((pagesOver && Number.isNaN(Number(pagesOver))) || (pagesUnder && Number.isNaN(Number(pagesUnder)))) {
            return res.status(400).json({
                status: "failed",
                message: "pagesOver or pagesUnder must be number"
            })
        }

        if (
            pagesOver &&
            pagesUnder &&
            Number(pagesOver) >= Number(pagesUnder)
        ) {
            return res.status(400).json({
                status: "failed",
                message: "pagesOver must be lower than pagesUnder"
            })
        }

        filter.pages = pagesOver ?
            pagesUnder ? { $gt: Number(pagesOver), $lt: Number(pagesUnder) } : { $gt: Number(pagesOver) }
            :
            { $lt: Number(pagesUnder) }
    }
    if (fromYear || toYear) {
        if ((fromYear && Number.isNaN(Number(fromYear))) || (toYear && Number.isNaN(Number(toYear)))) {
            return res.status(400).json({
                status: "failed",
                message: "pagesOver or pagesUnder must be number"
            })
        }

        if (fromYear > currentYear || toYear > currentYear) {
            return res.status(400).json({
                status: "failed",
                message: `invalid year, year must be under current year: ${currentYear}`
            })
        }

        if (fromYear > toYear) {
            return res.status(400).json({
                status: "failed",
                message: "fromYear must be lower than toYear"
            })
        }

        filter.publishedYear = fromYear ?
            toYear ? { $gte: fromYear, $lte: toYear } : { $gte: fromYear }
            :
            { $lte: toYear }
    }
    if (categories) {
        if (category) {
            return res.status(400).json({
                status: "failed",
                message: "you can use only category or categories not both"
            })
        }

        const categoriesArray = categories.split(",")
            .map(cat => cat.trim())
            .filter(Boolean);

        if (categoriesArray.length > 5) {
            return res.status(400).json({
                status: "failed",
                message: "you can use only 5 values in one time"
            })
        }
        filter.category = { $in: categoriesArray.map(cat => new RegExp(escapeRegex(cat), "i")) }
    }
    if (excludeStatuses) {
        if (status || notStatus) {
            return res.status(400).json({
                status: "failed",
                message: "you can use only status or excludeStatuses or notStatus not both"
            })
        }
        const statusArray = excludeStatuses.split(",")
            .map(status => status.trim())
            .filter(Boolean);

        filter.status = { $nin: statusArray.map(status => new RegExp(escapeRegex(status), "i")) }
    }
    if (tags) {
        const tagsArray = tags.split(",")
            .map(tag => tag.trim())
            .filter(Boolean);

        if (tagsArray.length > 5) {
            return res.status(400).json({
                status: "failed",
                message: "you can use only 5 values in one time"
            })
        }
        filter.tags = { $in: tagsArray.map(tag => new RegExp(escapeRegex(tag), "i")) }
    }

    if (fields) {
        const fieldsToArray = fields?.split(",")
            .map(filed => filed.trim())
            .filter(Boolean);
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
            .map(sor => sor.trim())
            .filter(Boolean);

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