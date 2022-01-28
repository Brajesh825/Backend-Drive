const NotFoundError = require("../../utils/NotFoundError");
const DbUtilFile = require("../../db/utils/fileUtils/index");
const jwt = require("jsonwebtoken");

const dbUtilsFile = new DbUtilFile();

class MongoFileService {
  constructor() {}
  renameFile = async (userID, fileID, title) => {
    const file = await dbUtilsFile.renameFile(fileID, userID, title);

    if (!file.lastErrorObject.updatedExisting)
      throw new NotFoundError("Rename File Not Found Error");

    return file;
  };

  makePublic = async (userID, fileID) => {
    const token = jwt.sign({ _id: userID.toString }, process.env.JWT_SECRET);

    const file = await dbUtilsFile.makePublic(fileID, userID, token);

    if (!file.lastErrorObject.updatedExisting)
      throw new NotFoundError("Make Public File Not Found Error");

    return token;
  };

  makeOneTimePublic = async (userID, fileID) => {
    const token = jwt.sign({ _id: userID.toString() }, process.env.JWT_SECRET);

    const file = await dbUtilsFile.makeOneTimePublic(fileID, userID, token);

    if (!file.lastErrorObject.updatedExisting)
      throw new NotFoundError("Make One Time Public Not Found Error");

    return token;
  };

  getFileInfo = async (userID, fileID) => {
    let currentFile = await dbUtilsFile.getFileInfo(fileID, userID);

    if (!currentFile) throw new NotFoundError("Get File Info Not Found Error");

    const parentID = currentFile.metadata.parent;

    let parentName = "";

    if (parentID === "/") {
      parentName = "Home";
    } else {
      const parentFolder = await Folder.findOne({
        owner: userID,
        _id: parentID,
      });

      if (parentFolder) {
        parentName = parentFolder.name;
      } else {
        parentName = "Unknown";
      }
    }

    return { ...currentFile, parentName };
  };
}

module.exports = MongoFileService;
