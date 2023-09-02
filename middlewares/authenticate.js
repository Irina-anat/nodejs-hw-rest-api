const { HttpError } = require('../helpers');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();

const { SECRET_KEY } = process.env;


const authenticate = async (req, _, next) => {
    // отримую заголовок Authorization
    const {authorization = ""} = req.headers;
    // Bearer eyJhbGciOiJIUzI1Ni..... розділяю на  bearer + token   
    const [bearer, token] = authorization.split(" ");

    if(bearer !== "Bearer") {
        next(HttpError(401));
    }

    try { // якщо токен не валідний або закінчився термін дії jwt повідомить про помилку, якщо токен валід - повер payload з id
        const {id} = jwt.verify(token, SECRET_KEY);
        // перевіряю чи є користувач в базі
         const user = await User.findById(id);
        if (!user || !user.token || user.token !==token) {
            next(HttpError(401));
        }
        // до об`єкту req додаю користувача
        req.user = user;
        next(); // якщо токен валідний - next передає обробку далі
    }
    catch {
        next(HttpError(401));
    }    
};

module.exports = authenticate;