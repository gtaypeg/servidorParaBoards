const bcrypt = require('bcrypt');

module.exports = {
    hashPass: async pass => {
        return await bcrypt.hash(pass, 12);
    },
    checkPass: async (pass, hash) => {
        return await bcrypt.compare(pass, hash);
    }
};
