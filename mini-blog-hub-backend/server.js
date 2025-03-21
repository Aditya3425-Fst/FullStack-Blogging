const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authorRoutes = require('./routes/authors'); // Import authors routes
const blogRoutes = require('./routes/blogs');     // Import blogs routes
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Routes
app.use('/authors', authorRoutes); // e.g., POST /authors/authors
app.use('/blogs', blogRoutes);  // Mount blog routes at root (or use '/blogs')
mongoose.connect(
        "mongodb+srv://adityakumartiwari3888:H9cVwnEQkH0UCL8V@cluster0.3tjbbfe.mongodb.net/",
        { useNewUrlParser: true }
    )
    .then(() => console.log("mongodb has connected"))
    .catch((err) => console.log(err));
app.listen(process.env.PORT || 3000, function () {
    console.log("the server has started on the port:", process.env.PORT || 3000);
});