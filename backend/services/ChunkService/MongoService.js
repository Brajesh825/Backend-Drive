const mongoose = require("mongoose");
const crypto = require("crypto");
const awaitUploadStream = require("./utils/awaitUploadStream");
const getBusboyData = require("./utils/getBusboyData");
const videoChecker = require("../../utils/videoChecker");
const imageChecker = require("../../utils/imageChecker");
const addToStorageSize = require("./utils/addToStorageSize");
const createThumbnailAny = require("./utils/createThumbailAny");
const NotFoundError = require("../../utils/NotFoundError");
const ForbiddenError = require("../../utils/ForbiddenError");
const Thumbnail = require("../../models/thumbnail");
const DbUtilFile = require("../../db/utils/fileUtils");
const awaitStream = require("./utils/awaitStream");
const ObjectID = require("mongodb").ObjectID;

const conn = mongoose.connection;

const DbUtilsFile = new DbUtilFile();

class MongoService {
  constructor() {}
  uploadFile = async (user, busboy, req) => {
    // const password = user.getEncryptionKey();
    // Password is unique encryption key
    const password = "ahskshdkj";
    if (!password) {
      throw new ForbiddenError("Invalid Encryption Key");
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

    const isVideo = videoChecker(filename);

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

    const bucketStream = bucket.openUploadStream(filename, { metadata });

    const allStreamsToErrorCatch = [file, cipher, bucketStream];

    const finishedFile = await awaitUploadStream(
      file.pipe(cipher),
      bucketStream,
      req,
      allStreamsToErrorCatch
    );
    await addToStorageSize(user, size, personalFile);

    const imageCheck = imageChecker(filename);

    if (finishedFile.length < 15728640 && imageCheck) {
      const updatedFile = await createThumbnailAny(
        finishedFile,
        filename,
        user
      );

      return updatedFile;
    } else {
      return finishedFile;
    }
  };

  getThumbnail = async (user, id) => {
    // const password = user.getEncryptionKey();
    // Password is unique encryption key
    const password = "ahskshdkj";
    if (!password) {
      throw new ForbiddenError("Invalid Encryption Key");
    }
    const thumbnail = await Thumbnail.findById(id);

    if (thumbnail.owner !== user._id.toString()) {
      throw new ForbiddenError("Thumbnail Unauthorized Error");
    }

    const iv = thumbnail.data.slice(0, 16);

    const chunk = thumbnail.data.slice(16);

    const CIPHER_KEY = crypto.createHash("sha256").update(password).digest();

    const decipher = crypto.createDecipheriv("aes256", CIPHER_KEY, iv);

    const decryptedThumbnail = Buffer.concat([
      decipher.update(chunk),
      decipher.final(),
    ]);

    return decryptedThumbnail;
  };

  downloadFile = async (user, fileID, res) => {
    const currentFile = await DbUtilsFile.getFileInfo(fileID, user._id);
    if (!currentFile) {
      throw new NotFoundError("Download File Not Found");
    }

    // const password = user.getEncryptionKey();
    // Password is unique encryption key
    const password = "ahskshdkj";
    if (!password) throw new ForbiddenError("Invalid Encryption Key");

    const bucket = new mongoose.mongo.GridFSBucket(conn.db);

    const IV = currentFile.metadata.IV.buffer;
    const readStream = bucket.openDownloadStream(new ObjectID(fileID));

    const CIPHER_KEY = crypto.createHash("sha256").update(password).digest();

    const decipher = crypto.createDecipheriv("aes256", CIPHER_KEY, IV);

    console.log(currentFile.length.toString());

    res.set("Content-Type", "binary/octet-stream");
    res.set(
      "Content-Disposition",
      'attachment; filename="' + currentFile.filename.filename + '"'
    );
    res.set("Content-Length", currentFile.length);

    const allStreamsToErrorCatch = [readStream, decipher];

    await awaitStream(readStream.pipe(decipher), res, allStreamsToErrorCatch);
  };
}

module.exports = MongoService;
