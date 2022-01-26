const mongoose = require("../../db/mongoose");
const crypto = require("crypto");
const awaitUploadStream = require("./utils/awaitUploadStream");
const getBusboyData = require("./utils/getBusboyData");
const videoChecker = require("../../utils/videoChecker");
const imageChecker = require("../../utils/imageChecker");
const addToStorageSize = require("./utils/addToStorageSize");
const createThumbnailAny = require("./utils/createThumbailAny");
const NotFoundError = require("../../utils/NotFoundError");
const ForbiddenError = require("../../utils/ForbiddenError");
const NotAuthorizedError = require("../../utils/NotAuthorizedError");
const Thumbnail = require("../../models/thumbnail");
const DbUtilFile = require("../../db/utils/fileUtils");
const awaitStream = require("./utils/awaitStream");
const ObjectID = require("mongodb").ObjectID;
const subtractFromStorageSize = require("./utils/subtractFromStorageSize");
const User = require("../../models/userModel");
const Folder = require("../../models/folder");

const conn = mongoose.connection;

const dbUtilsFile = new DbUtilFile();

class MongoService {
  constructor() {}
  uploadFile = async (user, busboy, req) => {
    const password = user.getEncryptionKey();
    // Password is unique encryption key
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
    const password = user.getEncryptionKey();
    // Password is unique encryption key
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
    const currentFile = await dbUtilsFile.getFileInfo(fileID, user._id);
    if (!currentFile) {
      throw new NotFoundError("Download File Not Found");
    }

    const password = user.getEncryptionKey();
    // Password is unique encryption key

    if (!password) throw new ForbiddenError("Invalid Encryption Key");

    const bucket = new mongoose.mongo.GridFSBucket(conn.db);

    const IV = currentFile.metadata.IV.buffer;
    const readStream = bucket.openDownloadStream(new ObjectID(fileID));

    const CIPHER_KEY = crypto.createHash("sha256").update(password).digest();

    const decipher = crypto.createDecipheriv("aes256", CIPHER_KEY, IV);

    res.set("Content-Type", "binary/octet-stream");
    res.set(
      "Content-Disposition",
      'attachment; filename="' + currentFile.filename.filename + '"'
    );
    res.set("Content-Length", currentFile.length);

    const allStreamsToErrorCatch = [readStream, decipher];

    await awaitStream(readStream.pipe(decipher), res, allStreamsToErrorCatch);
  };

  deleteFile = async (userID, fileID) => {
    console.log("checkpoint 1");
    let bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      chunkSizeBytes: 1024 * 255,
    });
    console.log("checkpoint 2");

    const file = await dbUtilsFile.getFileInfo(fileID, userID);
    console.log("checkpoint 3");

    if (!file) throw new NotFoundError("Delete File Not Found Error");
    console.log("checkpoint 4");

    if (file.metadata.thumbnailID) {
      await Thumbnail.deleteOne({ _id: file.metadata.thumbnailID });
    }
    console.log("checkpoint 5");

    await bucket.delete(new ObjectID(fileID));
    console.log("checkpoint 6");

    await subtractFromStorageSize(
      userID,
      file.length,
      file.metadata.personalFile
    );
    console.log("checkpoint 7");
  };

  getPublicDownload = async (fileID, tempToken, res) => {
    const file = await dbUtilsFile.getPublicFile(fileID);

    if (!file || !file.metadata.link || file.metadata.link !== tempToken) {
      throw new NotAuthorizedError("File Not Public");
    }

    const user = await User.findById(file.metadata.owner);

    const password = user.getEncryptionKey();

    if (!password) throw new ForbiddenError("Invalid Encryption Key");

    const bucket = new mongoose.mongo.GridFSBucket(conn.db);

    const IV = file.metadata.IV.buffer;

    const readStream = bucket.openDownloadStream(new ObjectID(fileID));

    const CIPHER_KEY = crypto.createHash("sha256").update(password).digest();

    const decipher = crypto.createDecipheriv("aes256", CIPHER_KEY, IV);

    res.set("Content-Type", "binary/octet-stream");
    res.set(
      "Content-Disposition",
      'attachment; filename="' + file.filename.filename + '"'
    );
    res.set("Content-Length", file.length);

    const allStreamsToErrorCatch = [readStream, decipher];

    await awaitStream(readStream.pipe(decipher), res, allStreamsToErrorCatch);

    if (file.metadata.linkType === "one") {
      await dbUtilsFile.removeOneTimePublicLink(fileID);
    }
  };

  deleteFolder = async (userID, folderID, parentList) => {
    let bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      chunkSizeBytes: 1024 * 255,
    });

    const parentListString = parentList.toString();

    await Folder.deleteMany({
      owner: userID,
      parentList: { $all: parentList },
    });
    await Folder.deleteMany({ owner: userID, _id: folderID });

    const fileList = await dbUtilsFile.getFileListByParent(
      userID,
      parentListString
    );

    if (!fileList) throw new NotFoundError("Delete File List Not Found");

    for (let i = 0; i < fileList.length; i++) {
      const currentFile = fileList[i];

      try {
        if (currentFile.metadata.thumbnailID) {
          await Thumbnail.deleteOne({ _id: currentFile.metadata.thumbnailID });
        }

        await bucket.delete(new ObjectID(currentFile._id));
      } catch (e) {
        console.log(
          "Could not delete file",
          currentFile.filename,
          currentFile._id
        );
      }
    }
  };

  // deleteAll = async (userID) => {
  //   let bucket = new mongoose.mongo.GridFSBucket(conn.db, {
  //     chunkSizeBytes: 1024 * 255,
  //   });

  //   await Folder.deleteMany({ owner: userID });

  //   const fileList = await dbUtilsFile.getFileListByOwner(userID);

  //   if (!fileList)
  //     throw new NotFoundError("Delete All File List Not Found Error");

  //   for (let i = 0; i < fileList.length; i++) {
  //     const currentFile = fileList[i];

  //     try {
  //       if (currentFile.metadata.thumbnailID) {
  //         await Thumbnail.deleteOne({ _id: currentFile.metadata.thumbnailID });
  //       }

  //       await bucket.delete(new ObjectID(currentFile._id));
  //     } catch (e) {
  //       console.log(
  //         "Could Not Remove File",
  //         currentFile.filename,
  //         currentFile._id
  //       );
  //     }
  //   }
  // };
}

module.exports = MongoService;
