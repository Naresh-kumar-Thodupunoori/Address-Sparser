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

const escapeRegex = (text) => {
    return text.replace(/[-\\/\\^$*+?.()|[\\]{}]/g, '\\$&');
};

const checkServiceability = async (req, res) => {
    const { latitude, longitude, address } = req.body;
    
    try {
        const societies = await Society.find();
        let within5km = false;
        
        // First, try to extract society name from the address
        const addressSocietyName = address.match(/(?:Block\s+[\w]+,\s+)(.+?)(?:,|$)/i)?.[1]?.trim();
        
        if (!addressSocietyName) {
            return res.json({ 
                societyName: 'Not Serviceable', 
                block: null, 
                flat: null, 
                within5km: false 
            });
        }

        // Find society by name and distance
        const matchedSociety = societies.find(society => {
            const isNearby = isWithinRadius(latitude, longitude, society.latitude, society.longitude, 5);
            const societyNameRegex = new RegExp(escapeRegex(society.name), 'i');
            return isNearby && societyNameRegex.test(addressSocietyName);
        });

        if (!matchedSociety) {
            return res.json({ 
                societyName: 'Not Serviceable', 
                block: null, 
                flat: null, 
                within5km: false 
            });
        }

        let matchedBlock = null;
        let allFlats = [];
        
        for (const block of matchedSociety.blocks) {
            allFlats = allFlats.concat(block.flats);
            const blockRegex = new RegExp(`\\b${escapeRegex(block.name)}\\b`, 'i');
            if (blockRegex.test(address)) {
                matchedBlock = block;
                break;
            }
        }
        
        const addressNumbers = address.match(/\d+/g) || [];
        let flatNumber = null;
        
        if (matchedBlock) {
            flatNumber = addressNumbers.find(num => matchedBlock.flats.includes(parseInt(num))) || null;
        } else {
            flatNumber = addressNumbers.find(num => allFlats.includes(parseInt(num))) || null;
        }
        
        return res.json({
            societyName: matchedSociety.name,
            block: matchedBlock ? matchedBlock.name : null,
            flat: flatNumber,
            within5km: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSocieties, checkServiceability };