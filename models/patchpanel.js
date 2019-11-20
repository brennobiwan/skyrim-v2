const Mongoose = require("mongoose");

const mongoose = require("../util/database");

const patchPanelSchema = new Mongoose.Schema({
    _patchpanel: {
        type: String,
        required: true,
      },
    capacity: Number,
    fullcapacity: Number,
    rack: String,
    az: String,
    cluster: String,
    type: String
});

const PatchPanel = mongoose.model("Panel", patchPanelSchema);

module.exports = PatchPanel;