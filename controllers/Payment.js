const Razorpay = require('razorpay');


exports.createOrder = async (req, res) => {
    // ye API se aa rha h frontend

    // const brand = new Brand(req.body);
    try {
        const instances = new Razorpay({
            key_id: "rzp_test_UQkhZssdSXYHpp",
            key_secret: process.env.PAYMENT_KEY_SECRET
        });

        const { orderId, amount, payment_capture, currency } = req.body;

        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: orderId,
            payment_capture: payment_capture
        };

        const order = await instances.orders.create(options);
        if(!order) return res.status(500).send("something occured")

        res.status(200).json({success:true,data:order});
        // const doc = await brand.save();
        // res.status(201).json(doc);
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.cardDetails = async (req, res) => {
    // ye API se aa rha h frontend

    try {
        const instances = new Razorpay({
            key_id: "rzp_test_UQkhZssdSXYHpp",
            key_secret: "7jOw3TN0NZCIBTaWU7QvnUJ9"
        });

        const { id} = req.body;


        const order = await instances.orders.fetch(id);
        if(!order) return res.status(500).send("something occured")

        res.status(200).json({success:true,data:order});
        // const doc = await brand.save();
        // res.status(201).json(doc);
    } catch (err) {
        res.status(400).json(err);
    }
}