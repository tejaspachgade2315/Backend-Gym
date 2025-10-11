const Lead = require('../models/Lead');
const User = require('../models/User');

const createLead = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const user = await User.findById(loggedInUser.userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (loggedInUser.role !== user.role) {
            return res.status(403).send("Unauthorized");
        }

        if (user.role === "user" || user.role === "trainer") {
            return res.status(403).send("Unauthorized");
        }
        const { name, phone } = req.body;
        const lead = new Lead({ name, phone });
        await lead.save();
        res.status(201).json({ message: 'Lead created successfully', lead });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


const getAllLeads = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const user = await User.findById(loggedInUser.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        if (loggedInUser.role !== user.role) {
            return res.status(403).send("Unauthorized");
        }
        if (user.role === "user" || user.role === "trainer") {
            return res.status(403).send("Unauthorized");
        }
        const leads = await Lead.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.status(200).json({ leads });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getConvertedLeads = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const user = await User.findById(loggedInUser.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        if (loggedInUser.role !== user.role) {
            return res.status(403).send("Unauthorized");
        }
        if (user.role === "user" || user.role === "trainer") {
            return res.status(403).send("Unauthorized");
        }
        const leads = await Lead.find({ status: 'converted' }).sort({ createdAt: -1 });
        res.status(200).json({ leads });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


const getLossLeads = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const user = await User.findById(loggedInUser.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        if (loggedInUser.role !== user.role) {
            return res.status(403).send("Unauthorized");
        }
        if (user.role === "user" || user.role === "trainer") {
            return res.status(403).send("Unauthorized");
        }
        const leads = await Lead.find({ status: 'loss' }).sort({ createdAt: -1 });
        res.status(200).json({ leads });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getLeadById = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const user = await User.findById(loggedInUser.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        if (loggedInUser.role !== user.role) {
            return res.status(403).send("Unauthorized");
        }
        if (user.role === "user" || user.role === "trainer") {
            return res.status(403).send("Unauthorized");
        }
        const { id } = req.params;
        const lead = await Lead.findById(id);
        if (!lead) {
            return res.status(404).send("Lead not found");
        }
        res.status(200).json({ lead });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateLead = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const user = await User.findById(loggedInUser.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        if (loggedInUser.role !== user.role) {
            return res.status(403).send("Unauthorized");
        }
        if (user.role === "user" || user.role === "trainer") {
            return res.status(403).send("Unauthorized");
        }
        const { id } = req.params;
        const { name, phone, status } = req.body;
        const lead = await Lead.findById(id);
        if (!lead) {
            return res.status(404).send("Lead not found");
        }
        lead.status = status;
        lead.name = name;
        lead.phone = phone;
        await lead.save();
        res.status(200).json({ message: 'Lead updated successfully', lead });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}



module.exports = { createLead, getAllLeads, getConvertedLeads, getLossLeads, getLeadById, updateLead };