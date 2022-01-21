const mongoose = require("../../../config/mongoose");
const conn = mongoose.connection;
const ObjectID = require("mongodb").ObjectID;
class DbUtil {
  constructor() {}

  getPublicFile = async (fileID) => {
    let file = await conn.db
      .collection("fs.files")
      .findOne({ _id: new ObjectID(fileID) });

    return file;
  };

  removeOneTimePublicLink = async (fileID) => {
    const file = await conn.db.collection("fs.files").findOneAndUpdate(
      { _id: new ObjectID(fileID) },
      {
        $unset: { "metadata.linkType": "", "metadata.link": "" },
      }
    );

    return file;
  };

  removeLink = async (fileID, userID) => {
    const file = await conn.db
      .collection("fs.files")
      .findOneAndUpdate(
        { _id: new ObjectID(fileID), "metadata.owner": new ObjectID(userID) },
        { $unset: { "metadata.linkType": "", "metadata.link": "" } }
      );

    return file;
  };

  makePublic = async (fileID, userID, token) => {
    const file = await conn.db
      .collection("fs.files")
      .findOneAndUpdate(
        { _id: new ObjectID(fileID), "metadata.owner": new ObjectID(userID) },
        { $set: { "metadata.linkType": "public", "metadata.link": token } }
      );

    return file;
  };

  getPublicInfo = async (fileID, tempToken) => {
    const file = await conn.db
      .collection("fs.files")
      .findOne({ _id: new ObjectID(fileID), "metadata.link": tempToken });

    return file;
  };

  makeOneTimePublic = async (fileID, userID, token) => {
    const file = await conn.db
      .collection("fs.files")
      .findOneAndUpdate(
        { _id: new ObjectID(fileID), "metadata.owner": new ObjectID(userID) },
        { $set: { "metadata.linkType": "one", "metadata.link": token } }
      );

    return file;
  };

  getFileInfo = async (fileID, userID) => {
    const file = await conn.db.collection("fs.files").findOne({
      "metadata.owner": new ObjectID(userID),
      _id: new ObjectID(fileID),
    });

    return file;
  };

  getQuickList = async (userID, s3Enabled) => {
    let query = { "metadata.owner": new ObjectID(userID) };

    if (!s3Enabled) {
      query = { ...query, "metadata.personalFile": null };
    }

    const fileList = await conn.db
      .collection("fs.files")
      .find(query)
      .sort({ uploadDate: -1 })
      .limit(10)
      .toArray();

    return fileList;
  };

  getList = async (queryObj, sortBy, limit) => {
    const fileList = await conn.db
      .collection("fs.files")
      .find(queryObj)
      .sort(sortBy)
      .limit(limit)
      .toArray();

    return fileList;
  };

  removeTempToken = async (user, tempToken) => {
    user.tempTokens = user.tempTokens.filter((filterToken) => {
      return filterToken.token !== tempToken;
    });

    return user;
  };

  getFileSearchList = async (userID, searchQuery) => {
    let query = {
      "metadata.owner": new ObjectID(userID),
      filename: searchQuery,
    };

    const fileList = await conn.db
      .collection("fs.files")
      .find(query)
      .limit(10)
      .toArray();

    return fileList;
  };

  renameFile = async (fileID, userID, title) => {
    const files = await conn.db.collection("fs.files").findOne({
      _id: new ObjectID(fileID),
      "metadata.owner": new ObjectID(userID),
    });

    files.filename.filename = title;

    const file = await conn.db
      .collection("fs.files")
      .findOneAndUpdate(
        { _id: new ObjectID(fileID), "metadata.owner": new ObjectID(userID) },
        { $set: { filename: files.filename } }
      );

    return file;
  };

  moveFile = async (fileID, userID, parent, parentList) => {
    const file = await conn.db.collection("fs.files").findOneAndUpdate(
      { _id: new ObjectID(fileID), "metadata.owner": new ObjectID(userID) },
      {
        $set: {
          "metadata.parent": parent,
          "metadata.parentList": parentList,
        },
      }
    );

    return file;
  };

  getFileListByParent = async (userID, parentListString) => {
    const fileList = await conn.db
      .collection("fs.files")
      .find({
        "metadata.owner": new ObjectID(userID),
        "metadata.parentList": { $regex: `.*${parentListString}.*` },
      })
      .toArray();

    return fileList;
  };

  getFileListByOwner = async (userID) => {
    const fileList = await conn.db
      .collection("fs.files")
      .find({ "metadata.owner": new ObjectID(userID) })
      .toArray();

    return fileList;
  };

  removeChunksByID = async (fileID) => {
    await conn.db.collection("fs.chunks").deleteMany({ files_id: fileID });
  };
}

module.exports = DbUtil;
