const bcrypt = require('bcrypt')

function hashPasword(password) {
    return bcrypt.hashSync(password, 10)
}

function verifyPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
}

module.exports = {
    hashPasword,
    verifyPassword
}