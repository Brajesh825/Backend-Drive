const mongoose = require("mongoose");
const crypto = require("crypto");
const awaitUploadStream = require("./utils/awaitUploadStream");
const getBusboyData = require("./utils/getBusboyData");
const videoChecker = require("../../utils/videoChecker");
const imageChecker = require("../../utils/imageChecker");
const addToStorageSize = require("./utils/addToStorageSize");
const createThumbnailAny = require("./utils/createThumbailAny");

const conn = mongoose.connection;

class MongoService {
  constructor() {}
  uploadFile = async (user, busboy, req) => {
    // const password = user.getEncryptionKey();

    const password = "ahskshdkj";
    if (!password) {
      return next(new ErrorHandler("Invalid Encryption Key", 403));
    }

    const initVect = crypto.randomBytes(16);

    const CIPHER_KEY = crypto.createHash("sha256").update(password).digest();

    const cipher = crypto.createCipheriv("aes256", CIPHER_KEY, initVect);

    const { file, filename, formData } = await getBusboyData(busboy);

    const parent = formData.get("parent") || "/";
    const parentList = formData.get("parentList") || "/";
    const size = formData.get("size") || "";
    const personalFile = formData.get("personal-file") ? true : false;
    let hasThumbnail = false;
    let thumbnailID = "";

    console.log("checkpoint 1");

    const isVideo = videoChecker(filename);

    console.log("checkpoint 2");

    const metadata = {
      owner: user._id,
      parent,
      parentList,
      hasThumbnail,
      thumbnailID,
      isVideo,
      size,
      IV: initVect,
    };

    let bucket = new mongoose.mongo.GridFSBucket(conn.db);
    console.log("checkpoint 3");

    const bucketStream = bucket.openUploadStream(filename, { metadata });

    console.log("checkpoint 4");

    const allStreamsToErrorCatch = [file, cipher, bucketStream];

    const finishedFile = await awaitUploadStream(
      file.pipe(cipher),
      bucketStream,
      req,
      allStreamsToErrorCatch
    );
    console.log("checkpoint 5");
    await addToStorageSize(user, size, personalFile);

    console.log("checkpoint 6");

    const imageCheck = imageChecker(filename);

    console.log("checkpoint 7");

    if (finishedFile.length < 15728640 && imageCheck) {
      const updatedFile = await createThumbnailAny(
        finishedFile,
        filename,
        user
      );

      console.log("checkpoint 8 - path1");

      return updatedFile;
    } else {
      console.log("checkpoint 8 - path2");

      return finishedFile;
    }
  };
}

module.exports = {
  MongoService,
};
