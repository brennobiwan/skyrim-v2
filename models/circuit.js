const Mongoose = require("mongoose");

const mongoose = require("../util/database");

// const Schema = Mongoose.Schema();

const circuitSchema = new Mongoose.Schema({
    _circuit: {
        type: String,
        required: true,
    },
    serviceprovider: String,
    bandwidth: Number,
    device: String,
    interface: String,
    rack: String,
    patchpanel: String,
    patchpanelport: String,
    az: String,
    cluster: String,
    ticket: String
});

const Circuit = mongoose.model("Circuit", circuitSchema);

module.exports = Circuit;