const handleMongooseError = (error, _, next) => {
  const { name, code } = error;
  // console.log(name)
  // console.log(code)  якщо дубль -409, помилка валідації - 400
  const status = (name === 'MongoServerError' && code === 11000) ? 409 : 400;
  error.status = status;
  next();
};

module.exports = handleMongooseError;