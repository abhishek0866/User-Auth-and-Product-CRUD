const bcrypt = require('bcryptjs');

const hashPassword = async password => {
    try {
        const pos = 10;
        return await new Promise((resolve) => {
            bcrypt.hash(password, pos, (err, hash) => {
                if (err) {
                    return err
                }
                resolve(hash);
                // console.log(hash) // Here we made normal password to hashpassword
            });
        });
    } catch (error) {
        console.log(err.message);
    };
};

module.exports = {
    hashPassword
};