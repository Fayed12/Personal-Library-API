// node
const fs = require("node:fs")

const deleteAll = (req, res) => {
    const { confirm } = Boolean(req.query)

    if (!confirm) {
        return res.status(404).json({
            status: "failed",
            message: "actions denied because you not confirm the delete all action"
        })
    }

    fs.writeFile(`${__dirname}/../../../booksData.json`, JSON.stringify([]), (err) => {
        if (err) {
            res.status(404).json({
                status: "failed",
                message: "something went wrong!"
            })
        } else {
            res.status(204).json({
                status: "success",
                message: {
                    data: []
                }
            })
        }
    })
}


module.exports = deleteAll