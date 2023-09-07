
const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");


const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  // const searchParams = {owner};
  // console.log(req.query) { page: '1', 'limit ': '20' }
  const { page = 1, limit = 20} = req.query;
  const skip = (page - 1) * limit;

  // typeof favorite === "undefined" ? delete searchParams.favorite : searchParams.favorite = favorite;

    const result = await Contact.find({owner}, "-createdAt -updatedAt",{ skip,
    limit,}).populate("owner", "email");
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
  // кожен контакт за окремим user
  // console.log(req.user)
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};


const updateContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.status(201).json(result);
};

const updateFavourite = async (req, res) => {
  const { contactId } = req.params;
  if (!req.body) throw HttpError(400, "missing field favorite");
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.status(201).json(result);
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