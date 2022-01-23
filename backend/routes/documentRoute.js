const express = require("express");

const DocumentController = require("../controllers/documentController.js");
const documentController = new DocumentController();

const router = express.Router();

router.route("/view").get(documentController.getDocument);

module.exports = router;
