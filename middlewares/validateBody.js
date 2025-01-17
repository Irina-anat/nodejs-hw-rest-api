const { HttpError } = require("../helpers");

const validateBody = schema => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next()
  }
  return func;
};

module.exports = validateBody; 

/*  const validateBody = schema => {
   const func = (req, _, next) => {
     if (!Object.keys(req.body).length) {
       const error = new Error("missing fields");
       error.status = 400;
       return next(error);
     } 
     const { error } = schema.validate(req.body);
     if (error) {
       next(HttpError(400, error.message));
     }
     next();
   };
   return func;
 }; 

module.exports = validateBody; */

