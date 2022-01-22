const express = require("express");
const { authFullUser } = require("../middleware/authFullUser");
const auth = require("../middleware/auth");
const FileController = require("../controllers/fileController");
const MongoService = require("../services/ChunkService/MongoService");

const router = express.Router();

const mongoService = new MongoService();

const fileController = new FileController(mongoService);

router.post("/upload", authFullUser, fileController.uploadFile);

router.get("/download/:id", authFullUser, fileController.downloadFile);

router.patch("/rename", auth, fileController.renameFile);

router.delete("/remove", auth, fileController.deleteFile);

router.get("/thumbnail/:id", authFullUser, fileController.getThumbnail);

router.patch("/make-public/:id", authFullUser, fileController.makePublic);

module.exports = router;
