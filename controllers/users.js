const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const Jimp = require('jimp');

const dotenv = require('dotenv');
dotenv.config(); 

const { User } = require('../models/user');
const { HttpError, ctrlWrapper } = require("../helpers");
const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const fs = require('fs/promises');


const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });// перед тим як реєструвати - перевірити чи є в базі user з таким email
  
    if (user) {
        throw HttpError(409, "Email in use")
    }
    // перед зберіганням хешую пароль
    const hashPassword = await bcrypt.hash(password, 10);
    // для генерації тимчасової аватарки
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });
    
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

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    // обробка аватарки 
    await Jimp.read(tempUpload).then((img) =>
        img.resize(250, 250).write(`${tempUpload}`)
    );

    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    // переміщення файлу
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });
    // console.log(req.file)
    console.log(tempUpload)
    console.log(resultUpload)
    res.json({
        avatarURL,
    });
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar)
};