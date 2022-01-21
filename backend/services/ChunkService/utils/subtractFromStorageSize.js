const User = require("../../../models/userModel");

const subtractFromStorageSize = async (userID, size, isPersonalFile) => {
  const user = await User.findById(userID);

  if (isPersonalFile) {
    user.storageDataPersonal.storageSize =
      user.storageDataPersonal.storageSize - size;
    if (user.storageDataPersonal.storageSize < 0)
      user.storageDataPersonal.storageSize = 0;
    await user.save();
    return;
  }

  if (
    !user.storageData ||
    (!user.storageData.storageSize && !user.storageData.storageLimit)
  )
    user.storageData = { storageSize: 0, storageLimit: 0 };

  user.storageData.storageSize = user.storageData.storageSize - size;

  if (user.storageData.storageSize < 0) user.storageData.storageSize = 0;

  await user.save();
};

module.exports = subtractFromStorageSize;
