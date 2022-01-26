const express = require("express");
const auth = require("../middleware/auth");
const MongoService = require("../services/ChunkService/MongoService");
// const FolderController = require("../controllers/folderController");

const mongoService = new MongoService();
// const folderController = new FolderController(mongoService);

const router = express.Router();

router.post("/upload", auth);

router.delete("/remove", auth);

router.get("/info/:id", auth);

router.delete("/remove-all", auth);

router.patch("/rename", auth);

router.get("/subfolder-list", auth);

router.patch("/move", auth);

module.exports = router;
