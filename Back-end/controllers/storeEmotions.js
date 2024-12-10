// const reports = require('../models/report'); 
// const handleStoreEmotions = async (req, res) => {
//     const { childName, sessionId, result } = req.body;

//     if (!childName || !sessionId || !Array.isArray(result)) {
//         return res.status(400).json({ error: 'childName, sessionId, and result array are required' });
//     }

//     try {
//         // Find the report document
//         const report = await reports.findOne({ childname: childName, sessionid: sessionId });

//         if (!report) {
//             return res.status(404).json({ error: 'No matching report found' });
//         }

//         // Update emotions for matching images
//         result.forEach(({ file, emotions = {}, dominant_emotion, dominant_score }) => {
//             const imagePath = `photos\\${childName}\\${sessionId}\\${file}`;
        
//             // Find the corresponding image by imgpath
//             const image = report.images.find(img => img.imgpath === imagePath);
        
//             if (image) {
//                 // Safely parse emotion values with defaults
//                 image.emotions = {
//                     angry: parseFloat(emotions.angry) || 0,
//                     disgust: parseFloat(emotions.disgust) || 0,
//                     fear: parseFloat(emotions.fear) || 0,
//                     happy: parseFloat(emotions.happy) || 0,
//                     sad: parseFloat(emotions.sad) || 0,
//                     surprise: parseFloat(emotions.surprise) || 0,
//                     neutral: parseFloat(emotions.neutral) || 0
//                 };
        
//                 // Handle max_emotion_img with default values
//                 image.max_emotion_img = {
//                     emotion: dominant_emotion || 'neutral', // Default to 'neutral' if undefined
//                     score: parseFloat(dominant_score) || 0 // Default to 0 if undefined
//                 };
//             } else {
//                 console.warn(`Image not found for path: ${imagePath}`);
//             }
//         });
        

//         // Mark the report as processed
//         report.isProcessed = true;

//         // Save the updated report document
//         await report.save();

//         res.status(200).json({ message: 'Emotions stored successfully and marked as processed', report });
//     } catch (error) {
//         console.error('Error updating emotions:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// module.exports = { handleStoreEmotions };




// controllers/emotionController.js
const reports = require('../models/report'); // Adjust the path as needed

const handleStoreEmotions = async (req, res) => {
    const { childName, sessionId, result } = req.body;

    if (!childName || !sessionId || !Array.isArray(result)) {
        return res.status(400).json({ error: 'childName, sessionId, and result array are required' });
    }

    try {
        // Find the report with the matching child name and session ID
        const report = await reports.findOne({ 
            childname: childName, 
            "sessions.sessionid": sessionId 
        });

        if (!report) {
            return res.status(404).json({ error: 'No matching report found' });
        }

        // Locate the specific session
        const session = report.sessions.find(s => s.sessionid === sessionId);

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Update emotions for each image in the session
        result.forEach(({ file, emotions = {}, dominant_emotion, dominant_score }) => {
            const imagePath = `photos/${childName}/${sessionId}/${file}`;
            console.log(`Processing image path: ${imagePath}`);

            // Find the image by its path
            const image = session.images.find(img => img.imgpath === imagePath);

            if (image) {
                console.log(`Updating emotions for image: ${imagePath}`);
                // Update emotions
                image.emotions = {
                    angry: parseFloat(emotions.angry) || 0,
                    disgust: parseFloat(emotions.disgust) || 0,
                    fear: parseFloat(emotions.fear) || 0,
                    happy: parseFloat(emotions.happy) || 0,
                    sad: parseFloat(emotions.sad) || 0,
                    surprise: parseFloat(emotions.surprise) || 0,
                    neutral: parseFloat(emotions.neutral) || 0
                };

                // Update max_emotion_img
                image.max_emotion_img = {
                    emotion: dominant_emotion || 'neutral',
                    score: parseFloat(dominant_score) || 0
                };
            } else {
                console.warn(`Image not found for path: ${imagePath}`);
            }
        });

        // Mark the session as processed
        session.isProcessed = true;

        // Save the updated report document
        await report.save();

        res.status(200).json({ 
            message: 'Emotions stored successfully and session marked as processed', 
            report 
        });
    } catch (error) {
        console.error('Error updating emotions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { handleStoreEmotions };


// const reports = require('../models/report');

// const handleStoreEmotions = async (req, res) => {
//     const { childName, sessionId, result } = req.body;

//     if (!childName || !sessionId || !Array.isArray(result)) {
//         return res.status(400).json({ error: 'childName, sessionId, and result array are required' });
//     }

//     try {
//         const report = await reports.findOne({ childname: childName, "sessions.sessionid": sessionId });

//         if (!report) {
//             return res.status(404).json({ error: 'No matching report found' });
//         }

//         const session = report.sessions.find(s => s.sessionid === sessionId);

//         if (!session) {
//             return res.status(404).json({ error: 'Session not found' });
//         }

//         // Map images for quick lookup
//         const imageMap = new Map(session.images.map(img => [img.imgpath, img]));
//         const missingImages = [];

//         result.forEach(({ file, emotions = {}, dominant_emotion, dominant_score }) => {
//             const imagePath = `photos/${childName}/${sessionId}/${file}`;
//             const image = imageMap.get(imagePath);

//             if (image) {
//                 image.emotions = {
//                     angry: parseEmotionValue(emotions.angry),
//                     disgust: parseEmotionValue(emotions.disgust),
//                     fear: parseEmotionValue(emotions.fear),
//                     happy: parseEmotionValue(emotions.happy),
//                     sad: parseEmotionValue(emotions.sad),
//                     surprise: parseEmotionValue(emotions.surprise),
//                     neutral: parseEmotionValue(emotions.neutral),
//                 };

//                 image.max_emotion_img = {
//                     emotion: dominant_emotion || 'neutral',
//                     score: parseEmotionValue(dominant_score),
//                 };
//             } else {
//                 missingImages.push(imagePath);
//             }
//         });

//         session.isProcessed = true;
//         await report.save();

//         res.status(200).json({
//             message: 'Emotions stored successfully and session marked as processed',
//             report,
//             missingImages,
//         });
//     } catch (error) {
//         console.error('Error updating emotions:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Helper function for parsing emotion values
// const parseEmotionValue = (value) => (isNaN(parseFloat(value)) ? 0 : parseFloat(value));

// module.exports = { handleStoreEmotions };
