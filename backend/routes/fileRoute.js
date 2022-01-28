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

router.get("/public/download/:id/:tempToken", fileController.getPublicDownload);

router.patch("/make-one/:id", auth, fileController.makeOneTimePublic);

router.get("/info/:id", auth, fileController.getFileInfo);

router.patch("/move", auth, fileController.moveFile);

router.post("/send-share-email", auth, fileController.sendEmailShare);

router.get("/public/info/:id/:tempToken", fileController.getPublicInfo);

router.delete("/remove-link/:id", auth, fileController.removeLink);

router.get("/quick-list", auth, fileController.getQuickList);

module.exports = router;
