const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");

class FileController {
  constructor(chunkService) {
    this.chunkService = chunkService;
  }

  uploadFile = catchAsyncErrors(async (req, res) => {
    if (!req.user) {
      return next(new ErrorHandler("User does not exist", 401));
    }

    const user = req.user;
    const busboy = req.busboy;
    req.pipe(busboy);
    const file = await this.chunkService.uploadFile(user, busboy, req);

    res.send(file);
  });
}

module.exports = { FileController };
