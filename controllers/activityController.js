const UserActivity = require("../models/UserActivity");

const getStreakData = async (req, res) => {
    const { userId } = req.params;
    try {
        const activities = await UserActivity.findById(userId).sort({ date: 1 });
        if (!activities || activities.length === 0){
            return res.status(200).json({ activities, currentStreak: 0, longestStreak: 0 });
        }
        let streak = 0;
        let longestStreak = 0;
        let lastDate = null;

        activities.forEach((activity) => {
            if (lastDate) {
                const diff = (activity.date - lastDate) / (1000 * 60 * 60 * 24);
                if (diff === 1) {
                    streak += 1;
                } else if (diff > 1) {
                    longestStreak = Math.max(longestStreak, streak);
                    streak = 1;
                }
            } else {
                streak = 1;
            }
            lastDate = activity.date;
        })

        longestStreak = Math.max(longestStreak, streak);
        res.status(200).json({ activities, currentStreak: streak, longestStreak });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const graphData = async (req, res) => {
    const { userId } = req.params;
    try {
        const activities = await UserActivity.findById(userId).sort({ date: 1 });
        if(!activities || activities.length === 0){
            return res.status(200).json({ activities, currentStreak: 0, longestStreak: 0 });
        }
        console.log(activities);
        const graphData = activities.map((activity) => ({
            date: activity.date.toISOString().split('T')[0],
            count: activity.activityCount,
        }))
        res.status(200).json(graphData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
const logActivity = async (req, res) => {
    const { userId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    try {
        let activiy = await UserActivity.findOne({ userId: userId, date: today });
        if (activiy) {
            activiy.activityCount += 1
        } else {
            activiy = new UserActivity({ userId: userId, date: today, activityCount: 1 });
        }
        await activiy.save();
        res.status(200).json({ message: "Activity logged", activiy });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getStreakData, graphData, logActivity };