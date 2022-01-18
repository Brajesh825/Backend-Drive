const removeChunks = require("./removeChunks");

const awaitUploadStream = (
  inputSteam,
  outputStream,
  req,
  allStreamsToErrorCatch
) => {
  return new Promise((resolve, reject) => {
    allStreamsToErrorCatch.forEach((currentStream) => {
      currentStream.on("error", (e) => {
        removeChunks(outputStream);

        reject({
          message: "Await Stream Input Error",
          code: 500,
          error: e,
        });
      });
    });

    req.on("aborted", () => {
      removeChunks(outputStream);
    });

    inputSteam.pipe(outputStream).on("finish", (data) => {
      resolve(data);
    });
  });
};

module.exports = awaitUploadStream;
