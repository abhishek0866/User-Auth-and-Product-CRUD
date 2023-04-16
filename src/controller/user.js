const { hashPassword } = require("../helper/helper");
const { create, select, update } = require("../models/users/user");
const jwt = require('jsonwebtoken');
const scrtKey = process.env.JWT_SECRET;
var nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { createProduct, delProduct, updateProduct } = require("../models/users/product");


const register = async (req, res, next) => {
    try {
        const inputs = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password
        }

        // Create hash password 
        let hashPass = await hashPassword(inputs.password)
        inputs.password = hashPass;

        // Create jwt token
        const token = jwt.sign(
            { email: inputs.email },
            scrtKey,
            { expiresIn: "2h" }
        )

        //  uuid
        const uuid = uuidv4(); // Create uuid
        const userToken = token + uuid; // Add uuid with token 
        inputs.token = userToken; // Store token with uuid to the database 

        let response = await create(inputs)
        console.log(response);


        // Create and send a Email messsage 
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'lalu.waveites@gmail.com',
                pass: 'kziabjvxtcqjmnjg'
            }
        });

        const mailOptions = {
            from: 'lalu.waveites@gmail.com',
            to: inputs.email,
            subject: 'Your Accounts Has been created',
            html: `<p>Dear ${inputs.name},</p><p>Your account has been successfully created.</p><p>Thank you for joining us.</p>`
        };

        const emailStatus = await transporter.sendMail(mailOptions);


        if (response) {
            res.json({ status: 'success', message: 'data saved.', token: userToken })
        } else {
            res.json({ status: 'failed', message: 'data not saved.' })
        }
    } catch (error) {
        console.log("err :", error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}


const login = async (req, res, next) => {
    try {
        const userEmail = req.body.email;
        const userPassword = req.body.password;
        const user = await select(["email", "password", "id"], { email: userEmail }); // Fetching the data from the database

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(userPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect email or password" });
        }

        const payload = {
            user_id: user.id,
            email: user.email
        };

        const token = jwt.sign(payload, scrtKey, { expiresIn: '1h' }); // Generating JWT token with payload and expiration time

        jwt.verify(token, scrtKey, (err, decoded) => { // Verifying JWT token
            if (err) {
                console.log(err);
                return res.status(401).json({ error: "Invalid token" });
            }
            return res.json({ message: "Login successful", token });
        });

        const result = await update({ token }, { id: user.id });
        if (!result) {
            return res.status(500).json({ error: "Failed to update user's token" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
};


const forgotPassword = async (req, res, next) => {
    try {
        const email = req.body.email;
        const results = await select(["email", "token"], { email }) // we have token
        const sendUserToken = results.token;

        if (!results.email) {
            return res.json({ msg: 'No account with that email exists' });
        }

        // Send password reset email using nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'lalu.waveites@gmail.com',
                pass: 'kziabjvxtcqjmnjg'
            }
        });

        const resetLink = `http://localhost:3000/resetPassword/${sendUserToken}`;

        const mailOptions = {
            from: 'lalu.waveites@gmail.com',
            to: email,
            subject: 'Password reset request',
            html: `
        <p>You are receiving this email because you (or someone else) have requested the reset of a password.</p>
        <p>Please click on the following link to complete the process:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('There was an error while sending the email:', err);
                return res.status(500).json({ msg: 'An error occurred while sending the email' });
            } else {
                console.log('Email sent:', response);
                return res.status(200).json({ msg: 'Password reset email sent' });
            }
        });
    } catch (error) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
};


const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.query;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        // Validate the password
        if (!password || password.length < 8) {
            return res.status(400).send({ error: "Password must be at least 8 characters long" });
        }

        if (password !== confirmPassword) {
            return res.status(400).send({ error: "Passwords do not match" });
        }

        // Hash the new password
        let hpass = await hashPassword(password);

        // Update the user's password and reset the token
        const updateStatus = await update({ password: hpass }, { token: token }) // Update the data 

        return res.send({ message: "Password reset successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Server error" });
    }
};


const changePassword = async (req, res, next) => {
    try {
        const authToken = req.headers.hasOwnProperty('authorization') ? req.headers.authorization.split(" ")[1] : null;
        const decoded = jwt.verify(authToken, scrtKey); // Verifying JWT token
        const user = await select(["password"], { id: decoded.user_id }); // Fetching user data from the database

        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect old password" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: "New password and confirm password do not match" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await update({ password: hashedPassword }, { id: decoded.user_id }); // Updating the user's password in the database
        if (result) {
            // Generate a new token with updated password
            const newToken = jwt.sign({ user_id: decoded.user_id }, scrtKey, { expiresIn: '1h' });
            return res.json({ message: "Password updated successfully", token: newToken });
        } else {
            return res.status(500).json({ error: "Failed to update password" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};


const logout = async (req, res, next) => {
    try {
        const authToken = req.headers.hasOwnProperty('authorization') ? req.headers.authorization.split(" ")[1] : null;
        const decoded = jwt.verify(authToken, scrtKey); // Verifying JWT token
        const user = await select(["id"], { id: decoded.user_id }); // Fetching user data from the database

        // Updating the user's token to an empty string
        const result = await update({ token: "" }, { id: user.id });
        if (result) {
            res.clearCookie("token"); // clear token cookie
            return res.json({ message: "Logout successful" });
        } else {
            return res.status(500).json({ error: "Failed to logout" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};


const products = async (req, res, next) => {
    try {
        const inputs = req.body.products;
        let response = await createProduct(inputs);

        if (response) {
            const ids = response.map(item => item.id);
            res.json({ status: 'success', message: 'data saved.', ids: ids });
        } else {
            res.json({ status: 'failed', message: 'data not saved.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    };
};


const deleteProducts = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const whereClause = { id: productId };
        const result = await delProduct(whereClause);

        if (result) {
            res.json({ status: 'success', message: 'Product deleted.', ids: productId });
        } else {
            res.json({ status: 'failed', message: 'Product not found.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong.' });
    }
};


const updateProducts = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const data = req.body;
        const result = await updateProduct(productId, data);
        if (result) {
            res.json({ status: 'success', message: 'Product updated.', ids: productId });
        } else {
            res.json({ status: 'failed', message: 'Product not found.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong.' });
    }
};


module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    logout,
    changePassword,
    products,
    deleteProducts,
    updateProducts
}