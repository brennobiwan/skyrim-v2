const fs = require("fs");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

exports.getIndex = (req, res, next) => {
    console.log("getIndex in admin controllers");
    res.status(200).render("index");
};

// NavBar Admin Controllers

exports.getAdd = (req, res, next) => {
    console.log("getAdd in admin controllers");
    res.status(200).render("admin/add");
};

exports.getUpdate = (req, res, next) => {
    console.log("getUpdate in admin controllers");
    res.status(200).render("admin/update");
};

exports.getDecommission = (req, res, next) => {
    console.log("getDecommission in admin controllers");
    res.status(200).render("admin/decommission");
};

// Add Submenu

exports.getAddCircuit = (req, res, next) => {
    console.log("getAddCircuit in admin controllers");
    res.status(200).render("admin/add-circuit");
};

exports.getAddPatchPanel = (req, res, next) => {
    console.log("getAddPatchPanel in admin controllers");
    res.status(200).render("admin/add-patchpanel");
};

exports.getAddAz = (req, res, next) => {
    console.log("getAddAz in admin controllers");
    res.status(200).render("admin/add-az");
};

exports.getUploadCsv = (req, res, next) => {
    console.log("getUploadCsv in admin controllers");
    res.status(200).render("admin/upload-csv");
};

exports.getTemplate = (req, res, next) => {
    console.log("getTemplate in admin controllers");
};

// Decommission Submenu

exports.getDecommissionCircuit = (req, res, next) => {
    console.log("getDecommissionCircuit in admin controllers");
    res.status(200).render("admin/decommission-circuit");
};

exports.getDecommissionPatchPanel = (req, res, next) => {
    console.log("getDecommissionCircuit in admin controllers");
    res.status(200).render("admin/decommission-patchpanel");
};