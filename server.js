const mongoose = require("mongoose");

const app = require('./app');

// const { DB_HOST } = require("./config");
const { DB_HOST, PORT = 3000 } = process.env; // змінні оточення

 mongoose.connect(DB_HOST)
  .then(() => {
    app.listen(PORT)
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  }); 







  /* mongoose.set('strictQuery', true);
mongoose.connect(DB_HOST)
  .then(() => console.log("Data base connect sucsess"))
.catch(error => console.log(error.message)) */



