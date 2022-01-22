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

  // Make Public
  makePublic = async (req, res) => {
    if (!req.user) {
      return;
    }
    try {
      const fileID = req.params.id;
      const userID = req.user._id;

      const token = await fileService.makePublic(userID, fileID);

      res.send(token);
    } catch (e) {
      console.log("\nMake Public Error File Route:", e.message);
      const code = !e.code
        ? 500
        : e.code >= 400 && e.code <= 599
        ? e.code
        : 500;
      res.status(code).send();
    }
  };

  // Public Download
  getPublicDownload = async (req, res) => {
    try {
      const ID = req.params.id;
      const tempToken = req.params.tempToken;

      await this.chunkService.getPublicDownload(ID, tempToken, res);
    } catch (e) {
      console.log("\nGet Public Download Error File Route:", e.message);
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
