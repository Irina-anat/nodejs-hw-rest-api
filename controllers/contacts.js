
const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");


const getAllContacts = async (_, res) => {
    const result = await Contact.find({}, "-createdAt -updatedAt");
    res.json(result); 
};

 const getById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.json(result); 
}; 

const addContact = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};


const updateContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.json(result);
};

const updateFavourite = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

 const deleteContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.json({
      message: "contact deleted",
    });
}; 

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getById: ctrlWrapper(getById), 
  addContact: ctrlWrapper(addContact),
  updateContactById: ctrlWrapper(updateContactById),
  updateFavourite: ctrlWrapper(updateFavourite),
  deleteContactById: ctrlWrapper(deleteContactById), 
};