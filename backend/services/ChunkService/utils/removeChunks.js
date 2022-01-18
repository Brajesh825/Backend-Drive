const DbUtilsFile = require("../../../db/utils/fileUtils");

const dbUtilsFile = new DbUtilsFile();

const removeChunks = async (bucketStream) => {
  const uploadID = bucketStream.id;

  try {
    if (!uploadID || uploadID.length === 0) {
      console.log("Invalid uploadID for remove chunks");
      return;
    }

    await dbUtilsFile.removeChunksByID(uploadID);
  } catch (e) {
    console.log("Could not remove chunks for canceled upload", uploadID, e);
  }
};

module.exports = removeChunks;
