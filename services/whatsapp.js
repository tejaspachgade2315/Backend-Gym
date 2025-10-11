const twilio = require("twilio");
require("dotenv").config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsAppMessage = async (recipientNumber, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER, // Your Twilio WhatsApp sender number
      to: `whatsapp:${recipientNumber}`,
    });

    console.log("WhatsApp message sent:", response.sid);
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
};

module.exports = { sendWhatsAppMessage };
