const User = require('../models/User');

const updateStreak = async (userId) => {
    const user = await User.findById(userId);
    const today = (new Date()).toLocaleDateString('en-IN', { dateStyle: 'medium' });
    console.log(today)
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toLocaleDateString('en-IN', { dateStyle: 'medium' });
    console.log(yesterday)
    if (user.lastLogin == today) {

    } else if (user.lastLogin == yesterday) {
        user.loginStreak = user.loginStreak + 1;
    } else {
        user.loginStreak = 1;
    }

    user.longestStreak = Math.max(user.longestStreak || 0, user.loginStreak);
    console.log(user.longestStreak)
    user.lastLogin = today;
    console.log(user.loginStreak)
    await user.save();

    return user.loginStreak;
}

module.exports = { updateStreak }