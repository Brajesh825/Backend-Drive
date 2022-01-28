const FileService = require("../services/FileService");
const sendEmail = require("../utils/sendEmail");

const fileService = new FileService();

class FileController {
  constructor(chunkService) {
    this.chunkService = chunkService;
  }

  // Get Thumbnail
  getThumbnail = async (req, res) => {
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

  makeOneTimePublic = async (req, res) => {
    try {
      const id = req.params.id;
      const userID = req.user._id;

      const token = await fileService.makeOneTimePublic(userID, id);

      res.send(token);
    } catch (e) {
      console.log("\nMake One Time Public Link Error File Route:", e.message);
      const code = !e.code
        ? 500
        : e.code >= 400 && e.code <= 599
        ? e.code
        : 500;
      res.status(code).send();
    }
  };

  getFileInfo = async (req, res) => {
    try {
      const fileID = req.params.id;
      const userID = req.user._id;

      const file = await fileService.getFileInfo(userID, fileID);

      res.send(file);
    } catch (e) {
      console.log("\nGet File Info Error File Route:", e.message);
      const code = !e.code
        ? 500
        : e.code >= 400 && e.code <= 599
        ? e.code
        : 500;
      res.status(code).send();
    }
  };

  moveFile = async (req, res) => {
    if (!req.user) {
      return;
    }

    try {
      const fileID = req.body.id;
      const userID = req.user._id;
      const parentID = req.body.parent;

      await fileService.moveFile(userID, fileID, parentID);

      res.send();
    } catch (e) {
      console.log("\nMove File Error File Route:", e.message);
      const code = !e.code
        ? 500
        : e.code >= 400 && e.code <= 599
        ? e.code
        : 500;
      res.status(code).send();
    }
  };

  sendEmailShare = async (req, res) => {
    try {
      const user = req.user;
      const fileID = req.body.id;
      const receiver = req.body.receiver;

      const userId = user._id.toString();

      const file = await fileService.getFileInfo(userId, fileID);

      if (!file.metadata.link) throw new Error("File is not Public");

      const fileLink = `${req.protocol}://${req.get(
        "host"
      )}/file-service/public/download/${fileID}/${file.metadata.link}`;

      const options = {
        email: receiver,
        subject: "A File Was Shared With You Through myDrive",
        message: `Please navigate to the following link to view the file ${fileLink}`,
      };
      await sendEmail(options);

      res.json({});
    } catch (e) {
      console.log("\nSend Share Email Error File Route:", e.message);
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
