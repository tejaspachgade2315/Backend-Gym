
const axios = require("axios");

const WHATSAPP_API_URL = "https://graph.facebook.com/v22.0/";
const PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WA_ACCESS_TOKEN;

const sendWhatsAppMessage = async (recipient, message) => {
  try {
    const response = await axios.post(
      `${WHATSAPP_API_URL}${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: recipient,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Message Sent:", response.data);
  } catch (error) {
    console.error("Error Sending Message:", error.response.data);
  }
};

// Example Usage
// sendWhatsAppMessage("91XXXXXXXXXX", "Hello from WhatsApp API!");

module.exports = { sendWhatsAppMessage };