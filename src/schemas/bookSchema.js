// mongoose
const mongoose = require("mongoose")

const currentYear = new Date().getUTCFullYear()

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "title is required"],
            minLength: [5, "minlength should be 5 letters"],
            unique: true,
            trim: true
        },
        author: {
            type: String,
            required: [true, "author is required"],
            minLength: [5, "minlength should be 5 letters"],
            trim: true
        },
        category: {
            type: String,
            required: [true, "category is required"],
            minLength: [5, "minlength should be 5 letters"],
            trim: true
        },
        pages: {
            type: Number,
            required: [true, "pages is required"],
            min: [0, "minium value is 0"],
            default: 0
        },
        pagesRead: {
            type: Number,
            required: [true, "pagesRead is required"],
            min: [0, "minium value is 0"],
            default: 0,
            validate: {
                validator: function (value) {
                    return value <= this.pages;
                },
                message: "pagesRead cannot be greater than pages"
            }
        },
        currentPage: {
            type: Number,
            required: [true, "currentPage is required"],
            min: [0, "minium value is 0"],
            default: 0,
            validate: {
                validator: function (value) {
                    return value <= this.pages;
                },
                message: "currentPage cannot be greater than pages"
            }
        },
        rating: {
            type: Number,
            required: [true, "rating is required"],
            min: [0, "minium value is 0"],
            max: [5, "maximum value is 5"],
            default: 0
        },
        status: {
            type: String,
            required: [true, "status is required"],
            enum: {
                values: ["planned", "reading", "completed"],
                message: "the status value must be one of:planned, or reading, or completed"
            },
            default: "planned",
            trim: true
        },
        publishedYear: {
            type: Number,
            required: [true, "publishedYear is required"],
            min: [1000, "minium year is 1000"],
            max: [Number(currentYear), `maximum value is ${currentYear}`],
        },
        tags: {
            type: [String],
            required: [true, "tags is required"],
            default: []
        }
    },
    {
        timestamps: true
    }
)

module.exports = bookSchema