const reports=require('../models/report');

async function handleSignUpDetails(req,res){
    const { username, email,password,confirmPassword } = req.body;
    try {
        await reports.create({
            childname: username,
            email: email,
            password:password
        });
        res.status(200).json({ message: 'SignUP details saved successfully' });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports={
    handleSignUpDetails
}