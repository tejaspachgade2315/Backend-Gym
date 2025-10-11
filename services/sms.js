const twilio = require("twilio");
require("dotenv").config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (recipientNumber, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: '+15393997712',
      to: "+91" + recipientNumber,
    });

    console.log("SMS sent:", response.sid);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

module.exports = { sendSMS };
