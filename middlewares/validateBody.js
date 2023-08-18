const { HttpError } = require("../helpers");

const validateBody = schema => (req, _, next) => {
  if (Object.keys(req.body).length === 0) {
    const error = new HttpError(400, "missing fields");
    return next(error);
  }
  const { error } = schema.validate(req.body);
  if (error) {
    next(new HttpError(400, error.message));
  }
  next();
};

module.exports = validateBody;



/* const { HttpError } = require("../helpers");

const validateBody = schema => {
    const func = (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            next(HttpError(400, error.message));
        }
        next()
    }
    return func;
};

module.exports = validateBody; */

/* const validateBody = (schema) => {
  const func = (req, _, next) => {
    if (Object.keys(req.body).length === 0) {
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
}; */

module.exports = validateBody;
