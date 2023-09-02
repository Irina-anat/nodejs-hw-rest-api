const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config(); 

const { User } = require('../models/user');
const { HttpError, ctrlWrapper } = require("../helpers");
const {SECRET_KEY} = process.env;


const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });// перед тим як реєструвати - перевірити чи є в базі user з таким email
  
    if (user) {
        throw HttpError(409, "Email in use")
    }
    // перед зберіганням хешую пароль
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hashPassword });
    
    res.status(201).json({
      user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
    })
};

const login = async (req, res) => {
    const { email, password } = req.body;
    // перевіряю чи є користувач з таким email і базі
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong")
    };
    // якщо є такий користувач, то порівнюю пароль
    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong")
    };
    
    const payload = {
        id: user._id,
    };

    // якщо паролі співпадають створ токен
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token,
        "user": {
            "email": "example@example.com",
            "subscription": "starter"
        }
    })
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({ email, subscription});
};

const logout = async (req, res) => {
    // id користувача, який розлог
    const { _id } = req.user;
    // видаляю токен
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json();
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout)
};