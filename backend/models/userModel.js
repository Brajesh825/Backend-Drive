const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");
dotenv.config({ path: "backend/config/config.env" });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxlength: [30, "Name can not exceed 30 characters"],
    minlength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpire: {
    type: Date,
    default: null,
  },
  emailConfirmationToken: {
    type: String,
    default: null,
  },
  storageData: {
    storageSize: Number,
    storageLimit: Number,
    failed: Boolean,
  },
  storageDataPersonal: {
    storageSize: Number,
    failed: Boolean,
  },
  privateKey: {
    type: String,
  },
  publicKey: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hashing and adding resetPasswordToken to user Schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

// Generating Email Confirmation token
userSchema.methods.getEmailConfirmationToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hashing and adding resetPasswordToken to user Schema
  this.emailConfirmationToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return resetToken;
};

userSchema.methods.generateEncryptionKeys = async function () {
  const user = this;
  const userPassword = user._id.toString();
  const masterPassword = process.env.KEY;

  const randomKey = crypto.randomBytes(32);

  const iv = crypto.randomBytes(16);
  const USER_CIPHER_KEY = crypto
    .createHash("sha256")
    .update(userPassword)
    .digest();
  const cipher = crypto.createCipheriv("aes-256-cbc", USER_CIPHER_KEY, iv);
  let encryptedText = cipher.update(randomKey);
  encryptedText = Buffer.concat([encryptedText, cipher.final()]);

  const MASTER_CIPHER_KEY = crypto
    .createHash("sha256")
    .update(masterPassword)
    .digest();
  const masterCipher = crypto.createCipheriv(
    "aes-256-cbc",
    MASTER_CIPHER_KEY,
    iv
  );
  const masterEncryptedText = masterCipher.update(encryptedText);

  this.privateKey = Buffer.concat([
    masterEncryptedText,
    masterCipher.final(),
  ]).toString("hex");
  this.publicKey = iv.toString("hex");
};

userSchema.methods.getEncryptionKey = function () {
  try {
    const user = this;
    const userPassword = user._id.toString();
    const masterEncryptedText = user.privateKey;
    const masterPassword = process.env.KEY;
    const iv = Buffer.from(user.publicKey, "hex");

    const USER_CIPHER_KEY = crypto
      .createHash("sha256")
      .update(userPassword)
      .digest();
    const MASTER_CIPHER_KEY = crypto
      .createHash("sha256")
      .update(masterPassword)
      .digest();

    const unhexMasterText = Buffer.from(masterEncryptedText, "hex");
    const masterDecipher = crypto.createDecipheriv(
      "aes-256-cbc",
      MASTER_CIPHER_KEY,
      iv
    );
    let masterDecrypted = masterDecipher.update(unhexMasterText);
    masterDecrypted = Buffer.concat([masterDecrypted, masterDecipher.final()]);

    let decipher = crypto.createDecipheriv("aes-256-cbc", USER_CIPHER_KEY, iv);
    let decrypted = decipher.update(masterDecrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted;
  } catch (e) {
    console.log("Get Encryption Key Error", e);
    return undefined;
  }
};

module.exports = mongoose.model("User", userSchema);
