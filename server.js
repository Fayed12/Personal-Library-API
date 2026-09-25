// local
const app = require("./src/app")
const Book = require("./src/schemas/models/bookModel")
const connectToMongoose = require("./src/services/connectToMongoose")


const port = process.env.PORT || 4000

connectToMongoose()

async function testBook() {
    try {
        const book = await Book.create({
            title: "Clean Code",
            author: "Robert Martin",
            category: "Software",
            pages: 464,
            pagesRead: 100,
            currentPage: 100,
            rating: 0,
            status: "reading",
            publishedYear: 2008,
            tags: ["programming", "software"]
        });

        console.log("Created book:");
        console.log(book);

        const foundBook = await Book.findOne({
            title: "Clean Code"
        });

        console.log("Found book:");
        console.log(foundBook);

    } catch (error) {
        console.log(error);
    }
}

testBook()

app.listen(port, () => {
    console.log(`app is running on port ${port}...`)
})