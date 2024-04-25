const express=require('express');
const { sendMail } = require('../controllers/Mail');

const router=express.Router();

router.post('/send',sendMail);

exports.router=router;