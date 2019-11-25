const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// Goes to the root of any route starting with "/admin".
router.get("/", adminController.getIndex);

router.get("/add", adminController.getAdd);

router.get("/update", adminController.getUpdate);

router.get("/decommission", adminController.getDecommission);

// Add GET

router.get("/add-circuit", adminController.getAddCircuit);

router.get("/add-patchpanel", adminController.getAddPatchPanel);

router.get("/add-az", adminController.getAddAz);

router.get("/upload-csv", adminController.getUploadCsv);

router.get("/get-template", adminController.getTemplate)

// Add POST

router.post("/add-circuit", adminController.postAddCircuit);

router.post("/update", adminController.postUpdate);

router.post("/update-circuit", adminController.postUpdateCircuit);

router.post("/add-az", adminController.postAddAz);

router.post("/add-patchpanel", adminController.postAddPatchPanel);

// Decommission Submenu

router.get("/decommission-circuit", adminController.getDecommissionCircuit);

router.get("/decommission-patchpanel", adminController.getDecommissionPatchPanel);

router.post("/delete", adminController.postDelete);

router.post("/delete-circuit", adminController.postDeleteCircuit);

module.exports = router;