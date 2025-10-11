const { decryptPassword } = require("../utils/helpers");

const fetchHome = (req, res) => {
    const encryptedPasswort = "c8f72975728539505b8d88533c21e07b"
    const decryptedPassword = decryptPassword(encryptedPasswort);
    console.log(decryptedPassword);
    const currentDate = new Date();
    console.log(new Date(currentDate.setDate(currentDate.getDate() + 1)));
    return res.send('Gym ERP');
}

module.exports = {
    fetchHome
}