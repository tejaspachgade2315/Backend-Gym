const GymProfile = require('../models/Gym');
const getGymProfile = async (req, res) => {
    try {
        const gymProfile = await GymProfile.find().populate('owner').populate('membershipPlans');
        if (!gymProfile) {
            return res.status(404).json({ message: "Gym profile not found" });
        }
        res.status(200).json(gymProfile);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


const addGymProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, address, phone, email, website, socialMedia, openingHours, membershipPlans } = req.body;
        const image=req.file ? req.file.path : null;
        const gymProfile = new GymProfile({ name, address, phone, email, website, owner: userId, socialMedia, image, openingHours, membershipPlans });
        await gymProfile.save();
        res.status(201).json(gymProfile);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const updateGymProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const { name, address, phone, email, website, socialMedia, openingHours, membershipPlans } = req.body;
        const image=req.file ? req.file.path : null;
        let gym = await GymProfile.findById(id);
        if (!gym) {
            return res.status(404).json({ message: "Gym profile not found" });
        }

        if (gym.owner.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        gym.name = name;
        gym.address = address;
        gym.phone = phone;
        gym.email = email;
        gym.website = website;
        gym.socialMedia = socialMedia;
        gym.image = image;
        gym.openingHours = openingHours;
        gym.membershipPlans = membershipPlans;
        gym.updatedAt = Date.now();
        await gym.save();
        res.status(200).json({ message: "Gym profile updated successfully", gym });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteGymProfile = async (req, res) => {
    try {
        const gymProfile = await GymProfile.findByIdAndDelete(req.params.id);
        if (!gymProfile) {
            return res.status(404).json({ message: "Gym profile not found" });
        }
        res.status(200).json({ message: "Gym profile deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getGymProfile, updateGymProfile, addGymProfile, deleteGymProfile };