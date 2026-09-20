function checkAllowedFields(body, allowedFields) {
    return Object.keys(body).every((field) =>
        allowedFields.includes(field)
    );
}

module.exports= checkAllowedFields