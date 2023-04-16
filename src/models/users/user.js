const { User } = require("./schema");

const create = async data =>{
    try {
        let results = await User.create(data);
        let response = await results.save();
        response = response.toJSON();
        return response
    } catch (error) {
        console.log(error);
    };
};

const select = async (columns, whereClause) => {
    try {
        const result = await User.findOne({
            attributes: columns,
            where: whereClause
        });
        if (result != null) {
            const data = result.toJSON();
            if (Object.keys(data).length > 0) {
                return data
            }
            return false
        }
        return false
    } catch (err) {
        console.log(err.message);
    }
};


const update = async (data, whereClause) => {
    try {
        let result = await User.update(data, {
            where: whereClause
        });
        if (result[0] > 0) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    create,
    select,
    update
}