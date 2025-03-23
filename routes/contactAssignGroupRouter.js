const express = require("express");
const isAuthenticated = require("../middleware/verifytoken");
const { assignContactsToGroup } = require("../controllers/contactGroupAssignController");
const contactAssignGroupRouter = express.Router();

contactAssignGroupRouter.post("/assignContactsingleToGroup", isAuthenticated, assignContactsToGroup);
//contactAssignGroupRouter.post("/assignMultipleconatctsToGroup", isAuthenticated, assignMultipleContacts);

module.exports = contactAssignGroupRouter;