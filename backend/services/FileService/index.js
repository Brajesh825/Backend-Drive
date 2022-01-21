const NotFoundError = require("../../utils/NotFoundError");
const DbUtilFile = require("../../db/utils/fileUtils/index");

const dbUtilsFile = new DbUtilFile();

class MongoFileService {
  constructor() {}
  renameFile = async (userID, fileID, title) => {
    const file = await dbUtilsFile.renameFile(fileID, userID, title);

    if (!file.lastErrorObject.updatedExisting)
      throw new NotFoundError("Rename File Not Found Error");

    return file;
  };
}

module.exports = MongoFileService;
