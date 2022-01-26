const express = require("express");
const auth = require("../middleware/auth");
const MongoService = require("../services/ChunkService/MongoService");
const FolderController = require("../controllers/folderController");

const mongoService = new MongoService();
const folderController = new FolderController(mongoService);

const router = express.Router();

router.post("/upload", auth, folderController.uploadFolder);

router.delete("/remove", auth, folderController.deleteFolder);

router.get("/info/:id", auth, folderController.getInfo);

router.delete("/remove-all", auth, folderController.deleteAll);

router.patch("/rename", auth, folderController.renameFolder);

router.get("/subfolder-list", auth, folderController.getSubfolderList);

router.patch("/move", auth, folderController.moveFolder);

module.exports = router;
