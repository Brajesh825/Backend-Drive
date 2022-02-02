const Folder = require("../../models/folder");
const InternalServerError = require("../../utils/InternalServerError.js");
const NotFoundError = require("../../utils/NotFoundError");
const UtlsFolder = require("../../db/utils/folderUtils");
const sortBySwitch = require("../../utils/sortBySwitchFolder.js");

const utilsFolder = new UtlsFolder();

class FolderService {
    constructor() {}

    uploadFolder = async(data) => {
        const folder = new Folder(data);
        await folder.save();

        if (!folder) throw new InternalServerError("Upload Folder Error");

        return folder;
    };

    getFolderInfo = async(userID, folderID) => {
        let currentFolder = await utilsFolder.getFolderInfo(folderID, userID);

        if (!currentFolder) throw new NotFoundError("Folder Info Not Found Error");

        const parentID = currentFolder.parent;

        let parentName = "";

        if (parentID === "/") {
            parentName = "Home";
        } else {
            const parentFolder = await utilsFolder.getFolderInfo(parentID, userID);

            if (parentFolder) {
                parentName = parentFolder.name;
            } else {
                parentName = "Unknown";
            }
        }

        const folderName = currentFolder.name;

        currentFolder = {...currentFolder._doc, parentName, folderName };
        // Must Use ._doc here, or the destucturing/spreading
        // Will add a bunch of unneeded variables to the object.

        return currentFolder;
    };

    renameFolder = async(userID, folderID, title) => {
        const folder = await utilsFolder.renameFolder(folderID, userID, title);

        if (!folder) throw new NotFoundError("Rename Folder Not Found");
    };

    getFolderSublist = async(userID, folderID) => {
        const folder = await utilsFolder.getFolderInfo(folderID, userID);

        if (!folder) throw new NotFoundError("Folder Sublist Not Found Error");

        const subfolderList = folder.parentList;

        let folderIDList = [];
        let folderNameList = [];

        for (let i = 0; i < subfolderList.length; i++) {
            const currentSubFolderID = subfolderList[i];

            if (currentSubFolderID === "/") {
                folderIDList.push("/");
                folderNameList.push("Home");
            } else {
                const currentFolder = await utilsFolder.getFolderInfo(
                    currentSubFolderID,
                    userID
                );

                folderIDList.push(currentFolder._id);
                folderNameList.push(currentFolder.name);
            }
        }

        folderIDList.push(folderID);
        folderNameList.push(folder.name);

        return {
            folderIDList,
            folderNameList,
        };
    };

    moveFolder = async(userID, folderID, parentID) => {
        let parentList = ["/"];

        if (parentID.length !== 1) {
            const parentFile = await utilsFolder.getFolderInfo(parentID, userID);
            parentList = parentFile.parentList;
            parentList.push(parentID);
        }

        const folder = await utilsFolder.moveFolder(
            folderID,
            userID,
            parentID,
            parentList
        );

        if (!folder) throw new NotFoundError("Move Folder Not Found");

        const folderChilden = await utilsFolder.findAllFoldersByParent(
            folderID.toString(),
            userID
        );

        folderChilden.map(async(currentFolderChild) => {
            let currentFolderChildParentList = currentFolderChild.parentList;

            const indexOfFolderID = currentFolderChildParentList.indexOf(
                folderID.toString()
            );

            currentFolderChildParentList =
                currentFolderChildParentList.splice(indexOfFolderID);

            currentFolderChildParentList = [
                ...parentList,
                ...currentFolderChildParentList,
            ];

            currentFolderChild.parentList = currentFolderChildParentList;

            await currentFolderChild.save();
        });
    };

    getFolderList = async(user, query) => {
        const userID = user._id;
        let searchQuery = query.search || "";
        const parent = query.parent || "/";
        let sortBy = query.sortby || "DEFAULT";
        const type = query.type || "mongo";
        const storageType = query.storageType || undefined;
        const folderSearch = query.folder_search || undefined;
        const itemType = query.itemType || undefined;
        sortBy = sortBySwitch(sortBy);

        const s3Enabled = user.s3Enabled ? true : false;

        if (searchQuery.length === 0) {
            const folderList = await utilsFolder.getFolderListByParent(
                userID,
                parent,
                sortBy,
                s3Enabled,
                type,
                storageType,
                itemType
            );

            if (!folderList) throw new NotFoundError("Folder List Not Found Error");

            return folderList;
        } else {
            searchQuery = new RegExp(searchQuery, "i");
            const folderList = await utilsFolder.getFolderListBySearch(
                userID,
                searchQuery,
                sortBy,
                type,
                parent,
                storageType,
                folderSearch,
                itemType,
                s3Enabled
            );

            if (!folderList) throw new NotFoundError("Folder List Not Found Error");

            return folderList;
        }
    };

    getSubfolderFullList = async(user, id) => {
        const userID = user._id;
        const folder = await utilsFolder.getFolderInfo(id, userID);

        const query = {
            parent: id,
        };

        const subFolders = await this.getFolderList(user, query);

        let folderList = [];

        const rootID = "/";

        let currentID = folder.parent;

        folderList.push({
            _id: folder._id,
            parent: folder._id,
            name: folder.name,
            subFolders: subFolders,
        });

        while (true) {
            if (rootID === currentID) break;

            const currentFolder = await this.getFolderInfo(userID, currentID);
            const currentSubFolders = await this.getFolderList(user, {
                parent: currentFolder._id,
            });

            folderList.splice(0, 0, {
                _id: currentFolder._id,
                parent: currentFolder._id,
                name: currentFolder.name,
                subFolders: currentSubFolders,
            });

            currentID = currentFolder.parent;
        }

        return folderList;
    };
}

module.exports = FolderService;