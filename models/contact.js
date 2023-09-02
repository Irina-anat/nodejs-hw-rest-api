const { Schema, model } = require('mongoose');
const Joi = require("joi");

const { handleMongooseError } = require('../helpers');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true }
);// щоб запис дата створ і онов

contactSchema.post("save", handleMongooseError);// помилка з вірним статусом 400
const Contact = model("contact", contactSchema);

const addSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .messages({ "any.required": `missing required name field` }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({ "any.required": `missing required email field` }),
  phone: Joi.string()
    .min(5)
    .required()
    .messages({ "any.required": `missing required phone field` }),
  favorite: Joi.boolean()
});


const updFavoriteSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({"any.required": `missing field favorite`}),
});

const schemas = {
  addSchema,
  updFavoriteSchema
};

module.exports = {
  Contact,
  schemas
};


