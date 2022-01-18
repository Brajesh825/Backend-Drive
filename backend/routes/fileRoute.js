const express = require("express");
const { authFullUser } = require("../middleware/authFullUser");
const { FileController } = require("../controllers/fileController");
const { MongoService } = require("../services/ChunkService/MongoService");

const router = express.Router();

const mongoService = new MongoService();

const fileController = new FileController(mongoService);

router.post("/upload", authFullUser, fileController.uploadFile);

module.exports = router;
