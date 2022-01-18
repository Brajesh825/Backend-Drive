const createThumbnailMongo = require("./createThumbnail");

const createThumnailAny = async (currentFile, filename, user) => {
  return await createThumbnailMongo(currentFile, filename, user);
};

module.exports = createThumnailAny;
