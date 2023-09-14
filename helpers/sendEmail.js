const nodemailer = require("nodemailer");
/* const dotenv = require('dotenv');
dotenv.config(); */
require("dotenv").config();

const { META_PASSWORD, META_EMAIL } = process.env;
// console.log(META_PASSWORD)
// console.log(META_EMAIL)

const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465, // 25, 465, 2525- не захищений
    secure: true,
    auth: {
        user: META_EMAIL,
        pass: META_PASSWORD
    }
};

// об`єкт який буде доставляти почту
const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = data => {
    const email = { ...data, from: META_EMAIL };
    return transport.sendMail(email);
};

module.exports = sendEmail;








/* const data = {
    to: "lojah77469@vip4e.com",
    subject: "Test email",
    html: "<strong>Test email</strong>"
}; */

/* const email = {
    from: META_EMAIL,
    to: "lojah77469@vip4e.com",
    subject: "Test email",
    html: "<strong>Test email</strong>"
}; */




/* transport.sendMail(email)
    .then(() => console.log("Email send success"))
    .catch((error) => console.log(error.message)); */

