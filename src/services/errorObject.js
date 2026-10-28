const createErrorObject = (message, status, statusCode, isOperational) => {
    const err = new Error(message)
    err.status = status
    err.statusCode = statusCode
    err.isOperational = isOperational

    // this line to remove this function from stack
    Error.captureStackTrace(err, createErrorObject)
    
    return err
}

module.exports = createErrorObject