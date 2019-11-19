const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const favicon = require('serve-favicon');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const errorRoute = require("./routes/error");

app.use(favicon(__dirname + '/public/images/favicon.ico'));

// app.use((req, res, next) => {
//     req.user = user;
// });

app.use("/admin", adminRoutes);
app.use(userRoutes);
app.use(errorRoute);

app.listen(3000, () => {
    console.log("Listening on port 3000");    
});
