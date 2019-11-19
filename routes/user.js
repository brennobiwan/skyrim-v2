const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

// NavBar GET 

router.get("/", userController.getIndex);

router.get("/report", userController.getReport);

router.get("/search", userController.getSearch);

// Search GET

router.get("/search-circuit", userController.getSearchCircuit);

router.get("/search-patchpanel", userController.getSearchPatchPanel);

// Search POST

router.post("/search-circuit", userController.postSearchCircuit);

// Report POST

router.post("/generate-report", userController.postGenerateReport);

// Report GET

router.get("/download-report", userController.getReportFile);

module.exports = router;

