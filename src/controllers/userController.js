// const users = require('../data');
// const jwt = require('jsonwebtoken');
//const mssql = require('mssql');
//const config = require('../auth/config/config')
const bcrypt = require('bcrypt');
const Joi = require('joi');


const session = require("../middlewares/session");

const { sendMailRegisterUser } = require('../utilis/userMail');
const { newUserValidator } = require('../validators/newUserValidate')


//exporting and defining route handlers/ controllers
module.exports = {

    getAllUsers: async(req, res) => {
        try {
            const pool = require("../../../server").pool;

            let results = await pool.query(`SELECT * from NewUsers`)

            let users = results.recordset;

            res.json({

                success: true,

                message: "fetched All users successfully",

                results: users



            })



        } catch (error) {


            console.error("Error getting all users:", error);
            res.status(500).send({
                error: "Internal server error"
            })



        }



    },

    // getUserById: (req, res) => {
    //     const { id } = req.params;
    //     const user = users.find((user) => user.id === Number(id));
    //     if (!user) {
    //         return res.status(404).json({ message: 'User not found' });
    //     }
    //     res.json(user);
    // },
    // updateUser: (req, res) => {
    //     const { id } = req.params;
    //     const { username, password } = req.body;
    //     const user = users.find((user) => user.id === Number(id));
    //     if (!user) {
    //         return res.status(404).json({ message: 'User not found' });
    //     }
    //     // Perform validation checks if needed
    //     user.username = username;
    //     user.password = password;
    //     res.json({ message: 'User was updated successfully' });
    // },

    // deleteUser: (req, res) => {
    //     const { id } = req.params;
    //     const userIndex = users.findIndex((user) => user.id === Number(id));
    //     if (userIndex === -1) {
    //         return res.status(404).json({ message: 'User not found' });
    //     }
    //     users.splice(userIndex, 1);
    //     res.json({ message: 'User was deleted successfully' });
    // },
    registerUser: async(req, res) => {
        try {
            const pool = require("../../../server").pool;

            //const { username, email, password, firstName, lastName } = req.body;

            // Validate user data
            // const { error } = newUserValidator.validate(req.body);
            // if (error) {
            //     return res.status(400).json({ error: error.details[0].message });
            // }
            let user = req.body
                // let salt = await bcrypt.genSalt(8),
                // let hashed_pwd = await bcrypt.hash(user.Password, salt)

            console.log(user)

            // let valid_user = newUserValidator(user) 
            let { value } = newUserValidator(user) //we can just destructure this to get the value of what we are passing to the database in this case the fullName, contactNumber, address and password//remember we got rid of the if(sql.connected) block since by now we have handled all the errors and have a legit user
            console.log(value)

            // Check if the username or email is already taken

            const userExists = await pool
                .request()
                .input("username", value.username)
                .input("email", value.email)
                .input("usernameTaken", 1)
                .input("emailTaken", 1)
                .execute("dbo.CheckUsernameAndEmailTaken");

            // if (userExists.recordset.length > 0) {
            //     return res.status(409).json({ error: "Username or email is already taken" });
            // }

            // Hash the password
            const hashedPassword = await bcrypt.hash(user.password, 10);

            // Insert the new user into the database
            const registeredAt = new Date().toISOString();
            await pool
                .request()
                .input("username", value.username)
                .input("email", value.email)
                .input("password", hashedPassword)
                .input("registeredAt", registeredAt)
                .input("firstName", value.firstName)
                .input("lastName", value.lastName)
                .execute("dbo.AddNewUser");

            // Send verification email
            // const verificationToken = generateVerificationToken();
            await sendMailRegisterUser(value.email, value.firstName);

            res.status(201).json({ message: "User registered successfully" });

        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ error: "An error occurred while registering the user" });
        }
    },


    loginUser: async(req, res) => {
        try {
            const pool = require("../../../server").pool;

            const { username, password } = req.body;

            // Find the user by username

            const result = await pool
                .request()
                .input("username", username)
                .query("SELECT * FROM NewUsers WHERE username = @username");
            const user = result.recordset[0];

            // Check if the user exists
            if (!user) {
                return res.status(401).json({ error: "Invalid username or password" });
            }

            // Compare the provided password with the stored hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: "Invalid username or password" });
            }

            // Store the user ID in the session
            req.session.userId = user.user_id;

            res.status(200).json({ message: "Login successful" });

        } catch (error) {
            console.error("Error logging in:", error);
            res.status(500).json({ error: "An error occurred while logging in" });
        }
    },

    logoutUser: async(req, res) => {
        // Destroy the session and redirect to the login page
        req.session.destroy((err) => {
            if (err) {
                console.error("Error logging out:", err);
            }
            res.redirect("/login");
        });
    },

    landingPage: (req, res) => {
        res.send("Welcome to the landing page!");
    }


}