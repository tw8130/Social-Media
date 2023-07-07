const nodemailer = require('nodemailer');
require('dotenv').config();
const email_config = require('../config/emailConfig');

// const message_options = {
//     to: ['samgitonga66@gmail.com', 'muchuicollins56@gmail.com', 'mwangitabitha2020@gmail.com'],
//     from: process.env.EMAIL_USER,
//     subject: "Welcome to our store",
//     text: "Yaay this works!",

// }


const transporter = nodemailer.createTransport(email_config)


//sign up
async function sendMailRegisterUser(email, firstName) {
    const messageOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: "Welcome to our Social Media Application",
        html: `<p>Dear ${firstName}</p>,

        <p>We are delighted to welcome you to our app! On behalf of our entire team, we extend a warm greeting and express our gratitude for choosing us as your go-to destination for social  interaction.
    
    
        Should you have any questions or require assistance, please don't hesitate to reach out to our friendly staff. We are here to make your experience with us enjoyable and fulfilling.
        Once again, welcome to our Social Media family! 
    
        Best regards,
        Socilite
        </p>`


    }


    try {
        let results = await transporter.sendMail(messageOptions)

        console.log(results)
    } catch (error) {
        console.log('Error sending email', error)
    }
}



module.exports = { sendMailRegisterUser }