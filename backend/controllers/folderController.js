const FolderService = require("../services/FolderService");

const folderService = new FolderService();

class FolderController {
  constructor(chunkService) {
    this.chunkService = chunkService;
  }

  uploadFolder = async (req, res) => {
    try {
      const data = req.body;
      data.owner = req.user._id;

      const folder = await folderService.uploadFolder(data);

      res.send(folder);
    } catch (e) {
      console.log("\nUpload Folder Error Folder Route:", e.message);
      const code = !e.code
        ? 500
        : e.code >= 400 && e.code <= 599
        ? e.code
        : 500;
      res.status(code).send();
    }
  };

  deleteFolder = async (req, res) => {
    try {
      const userID = req.user._id;
      const folderID = req.body.id;
      const parentList = req.body.parentList;

      await this.chunkService.deleteFolder(userID, folderID, parentList);

      res.send();
    } catch (e) {
      console.log("\nDelete Folder Error Folder Route:", e.message);
      const code = !e.code
        ? 500
        : e.code >= 400 && e.code <= 599
        ? e.code
        : 500;
      res.status(code).send();
    }
  };

  // getInfo = async (req, res) => {
  //   try {
  //     const userID = req.user._id;
  //     const folderID = req.params.id;

  //     const folder = await folderService.getFolderInfo(userID, folderID);

  //     res.send(folder);
  //   } catch (e) {
  //     console.log("\nGet Info Error Folder Route:", e.message);
  //     const code = !e.code
  //       ? 500
  //       : e.code >= 400 && e.code <= 599
  //       ? e.code
  //       : 500;
  //     res.status(code).send();
  //   }
  // };

  // deleteAll = async (req, res) => {
  //   try {
  //     const userID = req.user._id;

  //     await this.chunkService.deleteAll(userID);

  //     res.status(200).send({
  //       success: true,
  //       message: "Alls Files and Folder Successfully Deleted",
  //     });
  //   } catch (e) {
  //     console.log("\nDelete All Error Folder Route:", e.message);
  //     const code = !e.code
  //       ? 500
  //       : e.code >= 400 && e.code <= 599
  //       ? e.code
  //       : 500;
  //     res.status(code).send();
  //   }
  // };

  // renameFolder = async (req, res) => {
  //   try {
  //     const userID = req.user._id;
  //     const folderID = req.body.id;
  //     const title = req.body.title;

  //     await folderService.renameFolder(userID, folderID, title);

  //     res.status(200).send({
  //       success: true,
  //       message: "Rename successful",
  //     });
  //   } catch (e) {
  //     console.log("\nRename Folder Error Folder Route:", e.message);
  //     const code = !e.code
  //       ? 500
  //       : e.code >= 400 && e.code <= 599
  //       ? e.code
  //       : 500;
  //     res.status(code).send();
  //   }
  // };

  // getSubfolderList = async (req, res) => {
  //   try {
  //     const userID = req.user._id;
  //     const folderID = req.query.id;

  //     const { folderIDList, folderNameList } =
  //       await folderService.getFolderSublist(userID, folderID);

  //     res.send({ folderIDList, folderNameList });
  //   } catch (e) {
  //     console.log("\nGet Subfolder Error Folder Route:", e.message);
  //     const code = !e.code
  //       ? 500
  //       : e.code >= 400 && e.code <= 599
  //       ? e.code
  //       : 500;
  //     res.status(code).send();
  //   }
  // };

  // moveFolder = async (req, res) => {
  //   try {
  //     const userID = req.user._id;
  //     const folderID = req.body.id;
  //     const parent = req.body.parent;

  //     await folderService.moveFolder(userID, folderID, parent);

  //     res.send();
  //   } catch (e) {
  //     console.log("\nMove Folder Error Folder Route:", e.message);
  //     const code = !e.code
  //       ? 500
  //       : e.code >= 400 && e.code <= 599
  //       ? e.code
  //       : 500;
  //     res.status(code).send();
  //   }
  // };
}

module.exports = FolderController;
