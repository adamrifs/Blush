const Address = require("../models/addressSchema");

const addAddress = async (req, res) => {
    try {
        const newAddress = new Address(req.body);
        await newAddress.save()
        res.json({ success: true, address: newAddress });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Error saving address" });
    }
}

const getAddress = async (req, res) => {
    try {
        const { id } = req.params
        const addresses = await Address.find({ userId: id }).sort({ createdAt: -1 });
        res.json({ success: true, addresses });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Error fetching addresses" });
    }
}

module.exports = { addAddress, getAddress }