const { DataTypes, Sequelize } = require("sequelize");
const { dbConn } = require("../../libraries/databases/mysql/connection")

const User = dbConn.sequelize.define('dashes', {
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true,
        },
    },
    password: DataTypes.STRING,
    token: DataTypes.STRING,
}, {
    timestamps: false,
});

const products = dbConn.sequelize.define('products', {
    products_name: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.DATE,
    }
}, {
    timestamps: false, // Set this to true to enable createdAt and updatedAt fields
});

module.exports = {
    User,
    products
};

