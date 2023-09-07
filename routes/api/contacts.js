const express = require("express");

const ctrl = require("../../controllers/contacts");

const { validateBody, isValidId, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", authenticate, ctrl.getAllContacts);

router.get("/:contactId", authenticate, isValidId, ctrl.getById );

router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.addContact);

router.put("/:contactId", authenticate, isValidId, validateBody(schemas.addSchema),
  ctrl.updateContactById
);

router.patch(
  "/:contactId/favorite", authenticate, isValidId,
  validateBody(schemas.updFavoriteSchema),
  ctrl.updateFavourite,  
);

router.delete("/:contactId", authenticate, isValidId, ctrl.deleteContactById);

module.exports = router;












/* const express = require("express");
const Joi = require("joi");

const contacts = require("../../models/contacts");
const { HttpError } = require("../../helpers");

const router = express.Router();

const addSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  phone: Joi.string().min(5).required(),
});

router.get("/", async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  // console.log(req.params) { contactId: 'AeHIrLTr6JkxGE6SN-0Rw' }
  try {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);
    if (!result) {
      throw HttpError(404, "Not Found");// коли немає результату - генерується помилка
      // const error = new Error("Not found");
      // error.status = 404;
      // throw error;
       return res.status(404).json({
        message: "Not found"}) 
    }
    res.json(result);
  }
  catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    // console.log(error)
    if (error) {
      throw HttpError(400, error.message); 
    }
    // console.log(req.body);
     const result = await contacts.addContact(req.body);
     res.status(201).json(result);
  }
  catch (error) {
    next(error)
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.json({
      message: "contact deleted"
    });
  }
  catch (error) {
    next(error)
  }

});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body)
    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.json(result)
  } catch (error) {
    next(error);}
});

module.exports = router;
*/