const mongoose = require("mongoose");

const app = require('./app');

const DB_HOST = "mongodb+srv://IRYNA:41Zj911GTiUx0j4o@cluster0.p9hrd0y.mongodb.net/contacts_book?retryWrites=true&w=majority";

mongoose.set('strictQuery', true);

mongoose.connect(DB_HOST)
  .then(() => {
 app.listen(3000) 
})
  .catch(error => {
    console.log(error.message);
    process.exit(1);
})

