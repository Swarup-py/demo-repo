const bcrypt = require('bcrypt'); // password encrypt

async function hash_pass(password) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
}

async function compare_pass(password, real) {
    return await bcrypt.compare(password, real);
}

module.exports.hash_pass = hash_pass;
module.exports.compare_pass = compare_pass;


