// // //

const addToStoageSize = async (user, size, isPersonalFile) => {
  if (isPersonalFile) {
    //console.log("user storage")
    user.storageDataPersonal.storageSize =
      user.storageDataPersonal.storageSize + size;
    await user.save();
    return;
  }

  if (
    !user.storageData ||
    (!user.storageData.storageSize && !user.storageData.storageLimit)
  )
    user.storageData = { storageSize: 0, storageLimit: 0 };

  user.storageData.storageSize = user.storageData.storageSize + size;

  await user.save();
};

module.exports = addToStoageSize;
