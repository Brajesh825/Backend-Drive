const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  length: {
    type: Number,
    required: true,
  },
  chunkSize: {
    type: Number,
  },
  uploadDate: {
    type: Date,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  metadata: {
    type: {
      owner: {
        type: String,
        required: true,
      },
      parent: {
        type: String,
        required: true,
      },
      parentList: {
        type: String,
        required: true,
      },
      hasThumbnail: {
        type: Boolean,
        required: true,
      },
      isVideo: {
        type: Boolean,
        required: true,
      },
      thumbnailID: String,
      size: {
        type: Number,
        required: true,
      },
      IV: {
        type: Binary,
        required: true,
      },
      linkType: String,
      link: String,
      filePath: String,
      s3ID: String,
      personalFile: Boolean,
    },
    required: true,
  },
});

const File = mongoose.model("fs.files", fileSchema);

module.exports = File;
