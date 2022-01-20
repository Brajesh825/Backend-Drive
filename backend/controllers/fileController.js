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
}

module.exports = { FileController };
