const Mongoose = require("mongoose");

const mongoose = require("../util/database");

const clusterSchema = new Mongoose.Schema({
    _id: {
        type: String,
        required: true
    }
});

const Cluster = mongoose.model("Cluster", clusterSchema);

module.exports = Cluster;