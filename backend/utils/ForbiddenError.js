class ForbiddenError extends Error {
  constructor(args) {
    super(args);
    this.code = 403;
  }
}

module.exports = ForbiddenError;
