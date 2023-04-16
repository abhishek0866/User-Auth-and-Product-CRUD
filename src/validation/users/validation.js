const { register, login, resetPasswordSchema, changePasswordSchema, productSchema, updateProduct } = require("./schema");

const registerUser = async (req, res, next) => {
    try {
        const inputs = req.body;
        const value = await register.validate(inputs);
        if (value.error) {
            return res.json({ status: 'failed', message: value.error.details[0].message }).end();
        }
        return next();
    } catch (error) {
        return next(err);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const inputs = req.body;
        const value = await login.validate(inputs);
        if (value.error) {
            return res.json({ status: 'failed', message: value.error.details[0].message }).end();
        }
        return next();
    } catch (error) {
        return next(err);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const inputs = req.body;
        const value = await resetPasswordSchema.validate(inputs);
        if (value.error) {
            return res.json({ status: 'failed', message: value.error.details[0].message }).end();
        }
        return next();
    } catch (err) {
        return next(err);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const inputs = req.body;
        const value = await changePasswordSchema.validate(inputs);
        if (value.error) {
            return res.json({ status: 'failed', message: value.error.details[0].message }).end();
        }
        return next();
    } catch (err) {
        return next(err);
    }
};



const product = async (req, res, next) => {
    try {
        const inputs = req.body;
        const value = await productSchema.validate(inputs);
        if (value.error) {
            return res.json({ status: 'failed', message: value.error.details[0].message }).end();
        }
        return next();
    } catch (err) {
        return next(err);
    }
};


const updateProducts = async (req, res, next) => {
    try {
        const inputs = req.body;
        const value = await updateProduct.validate(inputs);
        if (value.error) {
            return res.json({ status: 'failed', message: value.error.details[0].message }).end();
        }
        return next();
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    registerUser,
    loginUser,
    resetPassword,
    changePassword,
    product,
    updateProducts
}