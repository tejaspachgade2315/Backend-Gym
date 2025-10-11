const Membership = require('../models/Membership');
const getAllPackages = async (req, res) => {
    try {
        const packages = await Membership.find();
        const updatedPackages = packages.map(pkg => ({
            ...pkg._doc,
            duration: pkg.duration / 30 
        }));
        res.status(200).json(updatedPackages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const addPackage = async (req, res) => {
    try {
        const { name, description, price, duration, features, isActive } = req.body;
        let updatedDuration = parseInt(duration) * 30;
        const package = new Membership({ name, description, price, duration: updatedDuration, features, isActive });
        await package.save();
        res.status(201).json(package);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const deletePackage = async (req, res) => {
    try {
        const package = await Membership.findByIdAndDelete(req.params.id);
        if (!package) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.status(200).json({ message: 'Package deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updatePackage = async (req, res) => {
    try {
        const { name, description, price, duration, features, isActive } = req.body;
        console.log(req.body);
        let updatedDuration = parseInt(duration) * 30;
        const package = await Membership.findByIdAndUpdate(req.params.id, { name, description, price, duration: updatedDuration, features, isActive }, { new: true });
        if (!package) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.status(200).json(package);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { getAllPackages, addPackage, deletePackage, updatePackage };