const FileService = require("../services/FileService");

const fileService = new FileService();

class FileController {
  constructor(chunkService) {
    this.chunkService = chunkService;
  }

  // Get Thumbnail
  getThumbnail = async (req, res) => {
    if (!req.user) {
      return;
    }
    try {
      const user = req.user;

      const id = req.params.id;

      const decryptedThumbnail = await this.chunkService.getThumbnail(user, id);

      res.send(decryptedThumbnail);
    } catch (e) {
      console.log("\nGet Thumbnail Error File Route:", e.message);
      const code = !e.code
        ? 500
        : e.code >= 400 && e.code <= 599
        ? e.code
        : 500;
      res.status(code).send();
    }
  };

  // Upload File
  uploadFile = async (req, res) => {
    if (!req.user) {
      return;
    }
    try {
      const user = req.user;
      const busboy = req.busboy;
      req.pipe(busboy);
      const file = await this.chunkService.uploadFile(user, busboy, req);

      res.send(file);
    } catch (e) {
      console.log("\nUploading File Error File Route:", e.message);
      const code = !e.code
        ? 500
        : e.code >= 400 && e.code <= 599
        ? e.code
        : 500;
      res.writeHead(code, { Connection: "close" });
      res.end();
    }
  };

  // Download File
  downloadFile = async (req, res) => {
    if (!req.user) {
      return;
    }

    try {
      const user = req.user;
      const fileID = req.params.id;

      await this.chunkService.downloadFile(user, fileID, res);
    } catch (e) {
      console.log("\nDownload File Error File Route:", e.message);
      const code = !e.code
        ? 500
        : e.code >= 400 && e.code <= 599
        ? e.code
        : 500;
      res.status(code).send();
    }
  };

  // Rename File
  renameFile = async (req, res) => {
    if (!req.user) {
      return;
    }
    try {
      const fileID = req.body.id;
      const title = req.body.title;
      const userID = req.user._id;

      console.log("No error on File Controller");

      await fileService.renameFile(userID, fileID, title);

      res.send();
    } catch (e) {
      console.log("\nRename File Error File Route:", e.message);
      const code = !e.code
        ? 500
        : e.code >= 400 && e.code <= 599
        ? e.code
        : 500;
      res.status(code).send();
    }
  };

  deleteFile = async (req, res) => {
    if (!req.user) {
      return;
    }

    try {
      const userID = req.user._id;
      const fileID = req.body.id;

      await this.chunkService.deleteFile(userID, fileID);

      res.send();
    } catch (e) {
      console.log("\nDelete File Error File Route:", e.message);
      const code = !e.code
        ? 500
        : e.code >= 400 && e.code <= 599
        ? e.code
        : 500;
      res.status(code).send();
    }
  };
}

module.exports = FileController;
