require("dotenv").config() // Load Environment
require("./src/libraries/databases/database");

const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const { register, login, forgotPassword, resetPassword, logout, changePassword, products, deleteProducts, updateProducts } = require("./src/controller/user");
const userValidate = require("./src/validation/users/validation");
const { deleteProduct } = require("./src/models/users/product");
const PORT = process.env.PORT || 8000;

app.use(cors()); // Allow cross-origin requests
app.use(helmet()) // Now Our app Secure
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.post("/api/register", userValidate.registerUser, register);
app.post("/api/login", userValidate.loginUser, login);
app.post("/api/forgotPassword", forgotPassword);
app.post("/api/resetPassword", userValidate.resetPassword, resetPassword);
app.post("/api/logout", logout);
app.post("/api/changePassword", userValidate.changePassword, changePassword);
app.post("/api/products", userValidate.product, products);
app.delete('/api/products/:id', deleteProducts);
app.put("/api/products/:id", userValidate.updateProducts, updateProducts);


app.use('*', (req, res) => {
    res.json({ code: 'failed', status: 'API not found' });
});

app.use(function (err, req, res, next) {
    let errMsg = err.message || err;
    console.log(errMsg);
    let errorObj = {
        code: 'error',
        data: errMsg
    }

    res.json(errorObj).end();
});

app.listen(PORT, () => {
    console.log(`Server is listening to the port number ${PORT}`);
})