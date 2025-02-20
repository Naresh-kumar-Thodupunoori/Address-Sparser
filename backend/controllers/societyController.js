const Society = require('../models/Society');
const { isWithinRadius } = require('../utils/geoUtils');

const getSocieties = async (req, res) => {
    try {
        const societies = await Society.find();
        res.json(societies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkServiceability = async (req, res) => {
    const { latitude, longitude, address } = req.body;

    try {
        const societies = await Society.find();
        const normalizedAddress = address.toLowerCase();

        // Find society name dynamically
        const matchedSociety = societies.find(society => 
            normalizedAddress.includes(society.name.toLowerCase())
        );

        if (!matchedSociety) {
            return res.json({
                societyName: 'Not Serviceable',
                block: null,
                flat: null,
                within5km: false
            });
        }

        // Check if the location is within a 5km radius
        const isNearby = isWithinRadius(latitude, longitude, matchedSociety.latitude, matchedSociety.longitude, 5);

        if (!isNearby) {
            return res.json({
                societyName: 'Not Serviceable',
                block: null,
                flat: null,
                within5km: false
            });
        }

        // Extract block name
        const blockMatch = address.match(/Block\s*(\d+|[A-Za-z]+)/i);
        const blockName = blockMatch ? blockMatch[1].toLowerCase() : null;
        const matchedBlock = matchedSociety.blocks.find(block => block.name.toLowerCase() === blockName);

        // Extract flat number
        const flatMatch = address.match(/Flat\s*(\d+)/i);
        const flatNumber = flatMatch ? parseInt(flatMatch[1]) : null;
        const isFlatValid = matchedBlock && matchedBlock.flats.includes(flatNumber);

        return res.json({
            societyName: matchedSociety.name,
            block: matchedBlock ? matchedBlock.name : null,
            flat: isFlatValid ? flatNumber : null,
            within5km: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getSocieties, checkServiceability };