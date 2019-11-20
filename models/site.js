const Mongoose = require("mongoose");

const mongoose = require("../util/database");

const azSchema = new Mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    cluster: String
});

const Az = mongoose.model("Site", azSchema);

module.exports = Az;