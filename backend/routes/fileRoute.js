const express = require("express");
const { authFullUser } = require("../middleware/authFullUser");
const { FileController } = require("../controllers/fileController");
const MongoService = require("../services/ChunkService/MongoService");

const router = express.Router();

const mongoService = new MongoService();

const fileController = new FileController(mongoService);

router.get("/thumbnail/:id", authFullUser, fileController.getThumbnail);

router.post("/upload", authFullUser, fileController.uploadFile);

router.get("/download/:id", authFullUser, fileController.downloadFile);

module.exports = router;
