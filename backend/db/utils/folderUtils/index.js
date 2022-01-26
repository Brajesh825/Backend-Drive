const Folder = require("../../../models/folder");
const { ObjectID } = require("mongodb");

class DbUtil {
  constructor() {}

  getFolderInfo = async (folderID, userID) => {
    const folder = await Folder.findOne({
      owner: userID,
      _id: new ObjectID(folderID),
    });

    return folder;
  };

  renameFolder = async (folderID, userID, title) => {
    const folder = await Folder.findOneAndUpdate(
      { _id: new ObjectID(folderID), owner: userID },
      { $set: { name: title } }
    );

    return folder;
  };

  getFolderSearchList = async (userID, searchQuery) => {
    let query = { owner: userID, name: searchQuery };

    const folderList = await Folder.find(query).limit(10);

    return folderList;
  };

  getFolderListByParent = async (
    userID,
    parent,
    sortBy,
    s3Enabled,
    type,
    storageType,
    itemType
  ) => {
    let query = { owner: userID, parent: parent };

    if (!s3Enabled) {
      query = { ...query, personalFolder: null };
    }

    if (type) {
      if (type === "mongo") {
        query = { ...query, personalFolder: null };
      } else if (type === "s3") {
        query = { ...query, personalFolder: true };
      }
    }

    if (itemType) {
      if (itemType === "personal") query = { ...query, personalFolder: true };
      if (itemType === "nonpersonal")
        query = { ...query, personalFolder: null };
    }

    const folderList = await Folder.find(query).sort(sortBy);

    return folderList;
  };

  getFolderListBySearch = async (
    userID,
    searchQuery,
    sortBy,
    type,
    parent,
    storageType,
    folderSearch,
    itemType,
    s3Enabled
  ) => {
    let query = { name: searchQuery, owner: userID };

    if (type) {
      if (type === "mongo") {
        query = { ...query, personalFolder: null };
      } else {
        query = { ...query, personalFolder: true };
      }
    }

    if (storageType === "s3") {
      query = { ...query, personalFolder: true };
    }

    if (parent && (parent !== "/" || folderSearch)) {
      query = { ...query, parent };
    }

    if (!s3Enabled) {
      query = { ...query, personalFolder: null };
    }

    if (itemType) {
      if (itemType === "personal") query = { ...query, personalFolder: true };
      if (itemType === "nonpersonal")
        query = { ...query, personalFolder: null };
    }

    const folderList = await Folder.find(query).sort(sortBy);

    return folderList;
  };

  moveFolder = async (folderID, userID, parent, parentList) => {
    const folder = await Folder.findOneAndUpdate(
      { _id: new ObjectID(folderID), owner: userID },
      { $set: { parent: parent, parentList: parentList } }
    );

    return folder;
  };

  findAllFoldersByParent = async (parentID, userID) => {
    const folderList = await Folder.find({
      parentList: parentID,
      owner: userID,
    });

    return folderList;
  };
}

module.exports = DbUtil;
