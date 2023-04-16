const { products } = require("./schema");

// Create the products
const createProduct = async data => {
    try {
        let results;

        if (Array.isArray(data)) {
            results = await products.bulkCreate(data);
        } else {
            const instance = products.build(data);
            const savedInstance = await instance.save();
            results = [savedInstance];
        }

        let response = results;

        if (Array.isArray(results)) {
            response = results.map(result => result.toJSON());
        } else {
            response = response.toJSON();
        }

        return response;
    } catch (error) {
        console.log(error);
    }
};

// Delete The product
const delProduct = async (whereClause) => {
    try {
        let result = await products.destroy({
            where: whereClause
        });
        if (result > 0) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error.message);
    }
};

// update the product 
const updateProduct = async (id, data) => {
    try {
        const result = await products.update(data, {
            where: { id }
        });

        if (result[0]) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error.message);
    }
};


module.exports = {
    createProduct,
    updateProduct,
    delProduct,
}