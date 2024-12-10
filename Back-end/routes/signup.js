const express=require('express');
const { handleSignUpDetails } = require('../controllers/signup');

const router=express.Router();

router.post('/',handleSignUpDetails);


module.exports=router;