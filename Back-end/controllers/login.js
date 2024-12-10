const reports = require('../models/report');

async function handleLoginDetails(req, res) {
    const { childName, password, sessionId } = req.body;

    try {
        // Find the document with matching childName and password
        const user = await reports.findOneAndUpdate(
            { childname:childName, password:password },       // Query to find the user
            { $push: { 
                sessions:{
                sessionid:sessionId 
            } }},       // Update the sessionId
                 // Return the updated document
        );

        if (user) {
            // If user is found and updated
            res.status(200).json({ message: 'Login successful', user });
        } else {
            // If no user is found, return an error message
            res.status(404).json({ error: 'Invalid login credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    handleLoginDetails
};
