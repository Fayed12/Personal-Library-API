// local
const createErrorObject = require("../../services/errorObject")

const developmentError = (err, res) => {
    return res.status(err.statusCode || 500).json({
        status: err.status || "failed",
        time: new Date().toISOString(),
        error: err,
        message: err.message || "something went wrong",
        stack: err.stack
    })
}

const productionError = (err, res) => {
    if (err?.isOperational) {
        return res.status(err.statusCode || 500).json({
            status: err.status || "failed",
            time: new Date().toISOString(),
            message: err.message || "something went wrong",
        })
    } else {
        return res.status(500).json({
            status: "failed",
            time: new Date().toISOString(),
            message: "something went wrong!"
        })
    }
}

const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;

    const error = createErrorObject(message, "failed", 400, true)

    return error;
}

const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(val => `${val.path}: ${val.message}`)

    const message = errors.join(". ")

    const error = createErrorObject(message, "failed", 400, true)

    return error
}

const handleDuplicateError = (err) => {
    // get the filed name that make the error
    const field = Object.keys(err?.keyValue).at(0)

    // get this filed value
    const value = err.keyValue[field]

    const message = ` ${field}: "${value}" already exists.`
    const error = createErrorObject(message, "failed", 409, true)

    return error
}

const errorController = (err, req, res, next) => {
    const projectStatus = process.env.NODE_ENV || "development"

    // 1- handle development errors
    if (projectStatus === "development") {
        return developmentError(err, res)

        // 2- handle production errors
    } else if (projectStatus === "production") {
        let error = err;

        // 2.1- handle cast errors, you can use the production res, but i need to create unique and clear message to user form cast error
        if (err.name === "CastError") {
            error = handleCastError(err)
        }

        // 2.2- handle validation errors and replace the validation from middleware in book router to here to make it in central error middleware
        if (err.name === "ValidationError") {
            error = handleValidationError(err)
        }

        // 2.3- handle duplicate error from mongoDB
        if (err.code) {
            if (err.code === 11000) {
                error = handleDuplicateError(err)
            }
        }

        return productionError(error, res)
    }

    return res.status(500).json({
        status: "error",
        time: new Date().toISOString(),
        message: "Something went wrong!"
    });
}

module.exports = errorController