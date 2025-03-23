const { addContact, getContactsByUser, updatecontact, deletecontact, getContactById, updatecontactstatusflag, isFavorite } = require("../controllers/contactController");
const isAuthenticated = require("../middleware/verifytoken");

const Routercontact = require("express").Router();

Routercontact.post("/addcontact", isAuthenticated, addContact);  //http://localhost:5000/contacts/addcontact

Routercontact.get("/getcontactsByUser", isAuthenticated, getContactsByUser); //http://localhost:5000/contacts/getcontactsByUser

Routercontact.put("/updatecontact/:id", isAuthenticated, updatecontact); // http://localhost:5000/contacts/updatecontact/67d3c588a34c8951eab08b1f

Routercontact.delete("/deletecontact/:id", isAuthenticated, deletecontact); // http://localhost:5000/contacts/deletecontact/67d3cd18cc73463e10039288

Routercontact.get("/getcontactById/:id", isAuthenticated, getContactById); // http://localhost:5000/contacts/getcontactById/67d3c588a34c8951eab08b1f

Routercontact.put("/updatecontactstatus/:id", isAuthenticated, updatecontactstatusflag); // http://localhost:5000/contacts/updatecontactstatus/67d3c588a34c8951eab08b1f
//isFavorite
Routercontact.put("/updatecontactisFavorite/:id", isAuthenticated, isFavorite); // http://localhost:5000/contacts/updatecontactisFavorite/67d3c588a34c8951eab08b1f

module.exports = Routercontact;