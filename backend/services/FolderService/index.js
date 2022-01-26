const Folder = require("../../models/folder");
const InternalServerError = require("../../utils/InternalServerError.js");
const NotFoundError = require("../../utils/NotFoundError");
const UtlsFolder = require("../../db/utils/folderUtils");

const utilsFolder = new UtlsFolder();

class FolderService {
  constructor() {}

  uploadFolder = async (data) => {
    const folder = new Folder(data);
    await folder.save();

    if (!folder) throw new InternalServerError("Upload Folder Error");

    return folder;
  };

  getFolderInfo = async (userID, folderID) => {
    let currentFolder = await utilsFolder.getFolderInfo(folderID, userID);

    if (!currentFolder) throw new NotFoundError("Folder Info Not Found Error");

    const parentID = currentFolder.parent;

    let parentName = "";

    if (parentID === "/") {
      parentName = "Home";
    } else {
      const parentFolder = await utilsFolder.getFolderInfo(parentID, userID);

      if (parentFolder) {
        parentName = parentFolder.name;
      } else {
        parentName = "Unknown";
      }
    }

    const folderName = currentFolder.name;

    currentFolder = { ...currentFolder._doc, parentName, folderName };
    // Must Use ._doc here, or the destucturing/spreading
    // Will add a bunch of unneeded variables to the object.

    return currentFolder;
  };

  renameFolder = async (userID, folderID, title) => {
    const folder = await utilsFolder.renameFolder(folderID, userID, title);

    if (!folder) throw new NotFoundError("Rename Folder Not Found");
  };

  getFolderSublist = async (userID, folderID) => {
    const folder = await utilsFolder.getFolderInfo(folderID, userID);

    if (!folder) throw new NotFoundError("Folder Sublist Not Found Error");

    const subfolderList = folder.parentList;

    let folderIDList = [];
    let folderNameList = [];

    for (let i = 0; i < subfolderList.length; i++) {
      const currentSubFolderID = subfolderList[i];

      if (currentSubFolderID === "/") {
        folderIDList.push("/");
        folderNameList.push("Home");
      } else {
        const currentFolder = await utilsFolder.getFolderInfo(
          currentSubFolderID,
          userID
        );

        folderIDList.push(currentFolder._id);
        folderNameList.push(currentFolder.name);
      }
    }

    folderIDList.push(folderID);
    folderNameList.push(folder.name);

    return {
      folderIDList,
      folderNameList,
    };
  };

  moveFolder = async (userID, folderID, parentID) => {
    let parentList = ["/"];

    if (parentID.length !== 1) {
      const parentFile = await utilsFolder.getFolderInfo(parentID, userID);
      parentList = parentFile.parentList;
      parentList.push(parentID);
    }

    const folder = await utilsFolder.moveFolder(
      folderID,
      userID,
      parentID,
      parentList
    );

    if (!folder) throw new NotFoundError("Move Folder Not Found");

    const folderChilden = await utilsFolder.findAllFoldersByParent(
      folderID.toString(),
      userID
    );

    folderChilden.map(async (currentFolderChild) => {
      let currentFolderChildParentList = currentFolderChild.parentList;

      const indexOfFolderID = currentFolderChildParentList.indexOf(
        folderID.toString()
      );

      currentFolderChildParentList =
        currentFolderChildParentList.splice(indexOfFolderID);

      currentFolderChildParentList = [
        ...parentList,
        ...currentFolderChildParentList,
      ];

      currentFolderChild.parentList = currentFolderChildParentList;

      await currentFolderChild.save();
    });
  };
}

module.exports = FolderService;
