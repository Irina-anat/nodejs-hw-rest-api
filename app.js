const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const authRouter = require('./routes/api/users');
const contactsRouter = require('./routes/api/contacts');

dotenv.config(); // додає секретні файли для змінних оточень з env 

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// app.use('/api/users', authRouter)
app.use('/users', authRouter)
app.use('/api/contacts', contactsRouter)

app.use((_, res) => {
  res.status(404).json({ message: 'Not found' })
});


// якщо next(error) код дійде в цю ф-ю - обробник помилок
app.use((err, _, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message, })
});

module.exports = app;
