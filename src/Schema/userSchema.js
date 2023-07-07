const joi = require('joi')


const new_user_schema = joi.object({
    firstName: joi.string().alphanum()
        .min(2).max(50)
        .required(),
    lastName: joi.string()
        .min(2)
        .max(50)
        .required(),
    email: joi.string().email()
        .min(5)
        .max(50),
    username: joi.string()
        .required()
        .max(30)
        .min(3),
    password: joi.string()
        .required()
        .pattern(new RegExp(/^[a-zA-Z0-9]{6,30}$/)),
    c_password: joi.ref('password')



}).with('password', 'c_password ')


module.exports = { new_user_schema }