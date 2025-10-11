const crypto = require('crypto');
const AesEncryption = require('aes-encryption');

require('dotenv').config();

const encryptPassword = (password) => {
    try {
        const aes = new AesEncryption();
        aes.setSecretKey(process.env.AES_SECRET_KEY);
        const encryptedPassword = aes.encrypt(password);
        return encryptedPassword;
    } catch (err) {
        console.log(err);
    }
}

const generatePassword = () => {
    try {
        const password = crypto.randomBytes(12).toString('hex');
        const aes = new AesEncryption();
        aes.setSecretKey(process.env.AES_SECRET_KEY);
        const encryptedPassword = aes.encrypt(password);
        return encryptedPassword;
    } catch (err) {
        console.log(err);
    }
}


const decryptPassword = (encryptedPassword) => {
    try {
        const aes = new AesEncryption();
        aes.setSecretKey(process.env.AES_SECRET_KEY);
        const password = aes.decrypt(encryptedPassword);
        return password;
    } catch (err) {
        console.log(err);
    }
}

const checkEquality = (a, b) => {
    return a === b;
}

const stringToObjectId = (id) => {
    return id.toString();
}

const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'long' });
}


module.exports = { generatePassword, encryptPassword, decryptPassword, checkEquality, stringToObjectId, getMonthName };