const express=require('express');
const { createOrder, cardDetails } = require('../controllers/Payment');


const router=express.Router();

router.post('/create',createOrder)
.post('/card-details',cardDetails);

exports.router=router;