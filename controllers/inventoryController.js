const Inventory = require("../models/Inventory");

const getAllInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find();
    res.status(200).json(inventoryItems);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getInventoryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryItem = await Inventory.findById(id);

    if (!inventoryItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(inventoryItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const addInventoryItem = async (req, res) => {
  try {
    const {
      name,
      description,
      quantity,
      lastMaintenanceDate,
      nextMaintenanceDate,
      status,
    } = req.body;
    const image = req.file ? req.file.path : null;
    const inventoryItem = await Inventory.create({
      name,
      description,
      quantity,
      lastMaintenanceDate,
      nextMaintenanceDate,
      status,
      image,
    });
    res.status(201).json(inventoryItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateInventoryItem = async (req, res) => {
  try {
    const {
      name,
      description,
      quantity,
      lastMaintenanceDate,
      nextMaintenanceDate,
      status,
    } = req.body;
    let image;

    if (req.body.image) {
      image = req.body.image;
    } else if (req.file) {
      image = req.file ? req.file.path : null;
    }
    const inventoryItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        quantity,
        lastMaintenanceDate,
        nextMaintenanceDate,
        status,
        image,
      },
      { new: true, runValidators: true }
    );
    res.status(200).json(inventoryItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    const inventoryItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.status(200).json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  getAllInventoryItems,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryItemById,
};
