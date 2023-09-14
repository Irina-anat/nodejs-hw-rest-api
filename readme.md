   Крок 1
Підготовка інтеграції з nodemailer 
   Крок 2
     Створення ендпоінта для верифікації email
Додати в модель User два поля verificationToken і verify. Значення поля verify рівне false означатиме, що його email ще не пройшов верифікацію

{
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
}
створити ендпоінт GET [/users/verify/:verificationToken](# verification-request), де по параметру verificationToken ми будемо шукати користувача в моделі User
якщо користувач з таким токеном не знайдений, необхідно повернути Помилку 'Not Found'
якщо користувач знайдений - встановлюємо verificationToken в null, а поле verify ставимо рівним true в документі користувача і повертаємо Успішний відповідь
Verification request
GET /auth/verify/:verificationToken
Verification user Not Found
Status: 404 Not Found
ResponseBody: {
  message: 'User not found'
}
Verification success response
Status: 200 OK
ResponseBody: {
  message: 'Verification successful',
}
Крок 3
Додавання відправки email користувачу з посиланням для верифікації
При створення користувача при реєстрації:

створити verificationToken для користувача і записати його в БД (для генерації токена використовуйте пакет uuid або nanoid)
відправити email на пошту користувача і вказати посилання для верифікації email'а ( /users/verify/:verificationToken) в повідомленні
Так само необхідно враховувати, що тепер логін користувача не дозволено, якщо не верифікувано email
Крок 4
Додавання повторної відправки email користувачу з посиланням для верифікації
Необхідно передбачити, варіант, що користувач може випадково видалити лист. Воно може не дійти з якоїсь причини до адресата. Наш сервіс відправки листів під час реєстрації видав помилку і т.д.

@ POST /users/verify
Отримує body в форматі {email}
Якщо в body немає обов'язкового поля email, повертає json з ключем {"message":"missing required field email"} і статусом 400
Якщо з body все добре, виконуємо повторну відправку листа з verificationToken на вказаний email, але тільки якщо користувач не верифікований
Якщо користувач вже пройшов верифікацію відправити json з ключем {"message":"Verification has already been passed"} зі статусом 400 Bad Request
Resending a email request
POST /users/verify
Content-Type: application/json
RequestBody: {
  "email": "example@example.com"
}
`` `

#### Resending a email validation error

```shell
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: <Помилка від Joi або іншої бібліотеки валідації>
Resending a email success response
Status: 200 Ok
Content-Type: application/json
ResponseBody: {
  "message": "Verification email sent"
}
Resend email for verified user
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
  message: "Verification has already been passed"
}
Content-Type: application/json
ResponseBody: {
  "avatarURL": "тут буде посилання на зображення"
}

# Неуспішна відповідь
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
Створи папку tmp в корені проекту і зберігай в неї завантажену аватарку.
Оброби аватарку пакетом jimp і постав для неї розміри 250 на 250
Перенеси аватарку користувача з папки tmp в папку public/avatars і дай їй унікальне ім'я для конкретного користувача.
Отриманий URL /avatars/<ім'я файлу з розширенням> та збережи в поле avatarURL користувача