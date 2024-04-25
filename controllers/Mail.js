// emailController.js

const nodemailer = require('nodemailer');

const sendMail = async (req, res) => {
  try {
    const { name, orderId, address, email, phone, price, totalItems, paymentMethod } = req.body;

    console.log("--------->",req.body,"<---------------")
    // Create a nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'ranjeetkumarmishra806@gmail.com',
        pass: process.env.APP_PASSWORD
      }
    });

    // Define email options
    const mailOptions = {
      from: 'ranjeetkumarmishra806@gmail.com',
      to: email,
      subject: 'Receipt for your purchase',
      text: `Dear ${name}
 Thank you for your purchase! Your order ID is ${orderId}. We are delighted to confirm your order and provide you with the following receipt details:
  Billing Information:

Name: ${name}
Address: ${address}
Email: ${email}
Phone Number: ${phone}
Total Items: ${totalItems}

Subtotal: Rs.${price}

Payment Method: ${paymentMethod}

If you have any questions or concerns regarding your purchase, please don't hesitate to contact us at farmersecomm@gmail.com or +91 1234567890.
Thank you once again for choosing Us. We hope you enjoy your purchase!

Warm regards,

Farmer's Ecomm

  Order ID may differ from ID in your order bag.`
    };
    console.log("--------->",mailOptions,"<---------------")

    // Send the email
    const data= await transporter.sendMail(mailOptions);

    console.log("--------->",data,"<---------------")

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { sendMail };
