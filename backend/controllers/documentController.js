const documentation = require("../Data/documentation");

class DocumentController {
  constructor() {}
  getDocument = async (req, res) => {
    res.json(documentation);
  };
}

module.exports = DocumentController;
