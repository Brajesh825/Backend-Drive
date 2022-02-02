const { ObjectID } = require("mongodb");

const createQuery = (
    owner,
    parent,
    sortBy,
    startAt,
    startAtDate,
    searchQuery,
    s3Enabled,
    startAtName,
    storageType,
    folderSearch
) => {
    let query = { "metadata.owner": new ObjectID(owner) };

    if (searchQuery !== "") {
        searchQuery = new RegExp(searchQuery, "i");

        query = {...query, filename: searchQuery };

        if (parent !== "/" || folderSearch)
            query = {...query, "metadata.parent": parent };
        //if (parent === "home") query = {...query, "metadata.parent": "/"};
    } else {
        query = {...query, "metadata.parent": parent };
    }

    if (startAt) {
        if (sortBy === "date_desc" || sortBy === "DEFAULT") {
            query = {...query, uploadDate: { $lt: new Date(startAtDate) } };
        } else if (sortBy === "date_asc") {
            query = {...query, uploadDate: { $gt: new Date(startAtDate) } };
        } else if (sortBy === "alp_desc") {
            query = {...query, filename: { $lt: startAtName } };
        } else {
            query = {...query, filename: { $gt: startAtName } };
        }
    }

    // if (s3Enabled) {
    //     query = {...query, "metadata.personalFile": true}
    // } else
    if (!s3Enabled) {
        query = {...query, "metadata.personalFile": null };
    }

    // if (storageType === "s3") {
    //     query = {...query, "metadata.personalFile": true}
    // }

    return query;
};

module.exports = createQuery;