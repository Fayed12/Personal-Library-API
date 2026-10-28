// local
const createErrorObject = require("../../services/errorObject")

const developmentError = (err, res) => {
    return res.status(err.statusCode || 500).json({
        status: err.status || "failed",
        error: err,
        message: err.message || "something went wrong",
        stack: err.stack
    })
}

const productionError = (err, res) => {
    if (err?.isOperational) {
        return res.status(err.statusCode || 500).json({
            status: err.status || "failed",
            message: err.message || "something went wrong",
        })
    } else {
        return res.status(500).json({
            status: "failed",
            message: "something went wrong!"
        })
    }
}

const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;

    const error = createErrorObject(message, "failed", 400, true)

    return error;
}

const errorController = (err, req, res, next) => {
    const projectStatus = process.env.NODE_ENV || "development"

    // 1- handle development errors
    if (projectStatus === "development") {
        return developmentError(err, res)

    // 2- handle production errors
    } else if (projectStatus === "production") {

        // 2.1- handle cast errors, you can use the production res, but i need to create unique and clear message to user form cast error
        const error = err.name === "CastError"
            ? handleCastError(err)
            : err;

        return productionError(error, res)
    }

    return res.status(500).json({
        status: "error",
        message: "Something went wrong!"
    });
}

module.exports = errorController