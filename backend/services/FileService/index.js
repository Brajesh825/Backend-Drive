const NotFoundError = require("../../utils/NotFoundError");
const DbUtilFile = require("../../db/utils/fileUtils/index");
const DbUtilFolder = require("../../db/utils/folderUtils");
const Folder = require("../../models/folder");
const jwt = require("jsonwebtoken");
const createQuery = require("../../utils/createQuery");
const dbUtilsFile = new DbUtilFile();
const dbUtilsFolder = new DbUtilFolder();

class MongoFileService {
    constructor() {}
    renameFile = async(userID, fileID, title) => {
        const file = await dbUtilsFile.renameFile(fileID, userID, title);

        if (!file.lastErrorObject.updatedExisting)
            throw new NotFoundError("Rename File Not Found Error");

        return file;
    };

    makePublic = async(userID, fileID) => {
        const token = jwt.sign({ _id: userID.toString }, process.env.JWT_SECRET);

        const file = await dbUtilsFile.makePublic(fileID, userID, token);

        if (!file.lastErrorObject.updatedExisting)
            throw new NotFoundError("Make Public File Not Found Error");

        return token;
    };

    makeOneTimePublic = async(userID, fileID) => {
        const token = jwt.sign({ _id: userID.toString() }, process.env.JWT_SECRET);

        const file = await dbUtilsFile.makeOneTimePublic(fileID, userID, token);

        if (!file.lastErrorObject.updatedExisting)
            throw new NotFoundError("Make One Time Public Not Found Error");

        return token;
    };

    getFileInfo = async(userID, fileID) => {
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

        return {...currentFile, parentName };
    };

    moveFile = async(userID, fileID, parentID) => {
        let parentList = ["/"];

        if (parentID.length !== 1) {
            const parentFile = await dbUtilsFolder.getFolderInfo(parentID, userID);
            if (!parentFile)
                throw new NotFoundError("Rename Parent File Not Found Error");
            parentList = parentFile.parentList;
            parentList.push(parentID);
        }

        const file = await dbUtilsFile.moveFile(
            fileID,
            userID,
            parentID,
            parentList.toString()
        );

        if (!file.lastErrorObject.updatedExisting)
            throw new NotFoundError("Rename File Not Found Error");

        return file;
    };

    getPublicInfo = async(fileID, tempToken) => {
        const file = await dbUtilsFile.getPublicInfo(fileID, tempToken);
        if (!file || !file.metadata.link || file.metadata.link !== tempToken) {
            throw new NotFoundError("Public Info Not Found");
        } else {
            return file;
        }
    };

    removeLink = async(userID, fileID) => {
        const file = await dbUtilsFile.removeLink(fileID, userID);

        if (!file.lastErrorObject.updatedExisting)
            throw new NotFoundError("Remove Link File Not Found Error");
    };

    getQuickList = async(user) => {
        const userID = user._id;
        const s3Enabled = user.s3Enabled ? true : false;

        const quickList = await dbUtilsFile.getQuickList(userID, s3Enabled);

        if (!quickList) throw new NotFoundError("Quick List Not Found Error");

        return quickList;
    };

    getList = async(user, query) => {
        const userID = user._id;

        let searchQuery = query.search || "";
        const parent = query.parent || "/";
        let limit = query.limit || 50;
        let sortBy = query.sortby || "DEFAULT";
        const startAt = query.startAt || undefined;
        const startAtDate = query.startAtDate || "0";
        const startAtName = query.startAtName || "";
        const storageType = query.storageType || undefined;
        const folderSearch = query.folder_search || undefined;
        sortBy = sortBySwitch(sortBy);
        limit = parseInt(limit);

        const s3Enabled = user.s3Enabled ? true : false;

        const queryObj = createQuery(
            userID,
            parent,
            query.sortby,
            startAt,
            startAtDate,
            searchQuery,
            s3Enabled,
            startAtName,
            storageType,
            folderSearch
        );

        const fileList = await dbUtilsFile.getList(queryObj, sortBy, limit);

        if (!fileList) throw new NotFoundError("File List Not Found");

        return fileList;
    };
}

module.exports = MongoFileService;