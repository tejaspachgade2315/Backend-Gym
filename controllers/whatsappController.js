const axios = require('axios');
const TinyURL = require('tinyurl');
const User = require("../models/User");

const refreshToken = async () => {
    try {
        const response = await axios.get('https://graph.facebook.com/v12.0/oauth/access_token', {
            params: {
                grant_type: 'fb_exchange_token',
                client_id: process.env.WHATSAPP_CLIENT_ID,
                client_secret: process.env.WHATSAPP_CLIENT_SECRET,
                fb_exchange_token: process.env.WHATSAPP_ACCESS_TOKEN,
            },
        });

        const newAccessToken = response.data.access_token;
        process.env.WHATSAPP_ACCESS_TOKEN = newAccessToken;

        console.log('Access token refreshed:', newAccessToken);
    } catch (error) {
        console.error('Error refreshing access token:', error.response?.data || error.message);
    }
};

const sendMessage = async (req, res) => {
    try {
        const loggedInUser = await User.findById(req.user.userId);
        if (!loggedInUser) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        if (loggedInUser.role !== "admin") {
            return res.status(403).json({ success: false, error: "Unauthorized" });
        }

        if (loggedInUser.waCounter > process.env.WALIMIT) {
            return res.status(403).json({ success: false, error: "Whatsapp messaging limit exceeded" });
        }

        loggedInUser.waCounter = loggedInUser.waCounter + 1;
        await loggedInUser.save();
        const { phone, message } = req.body;
        if (!phone || !message) {
            return res.status(400).json({ success: false, error: "Phone and message are required!" });
        }

        const response = await axios.post(
            `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: "91" + phone,
                type: "text",
                text: { body: message }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const result = await response.data;

        if (result.error) {
            throw new Error({ success: false, error: result.error.message });
        }

        return res.json({ success: true, result });
    } catch (error) {
        // if (error.response?.status === 401) {
        //     await refreshToken();
        //     return sendMessage(req, res); // Retry the request with the new token
        // }
        console.log("Errored")
        // console.error("WhatsApp API Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const sendWhatsAppTemplate = async (req, res) => {
    try {
        const loggedInUser = await User.findById(req.user.userId);
        if (!loggedInUser) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        if (loggedInUser.role !== "admin") {
            return res.status(403).json({ success: false, error: "Unauthorized" });
        }

        loggedInUser.waCounter = loggedInUser.waCounter + 1;
        await loggedInUser.save();
        const { phone, name, organization } = req.body;
        const invoice = req.file ? req.file.path : null;
        if (!phone || !name || !organization || !invoice) {
            return res.status(400).json({ success: false, error: "All fields are required!" });
        }

        const tinyUrl = await TinyURL.shorten(invoice);
        const response = await axios.post(
            `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: "91" + phone,
                type: "template",
                template: {
                    name: "membership_invoice",
                    language: { code: "en" },
                    components: [
                        {
                            type: "BODY",
                            parameters: [
                                { type: "text", text: name },
                                { type: "text", text: organization },
                                { type: "text", text: tinyUrl }
                            ]
                        }
                    ]
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.json({ success: true, data: response.data });
    } catch (error) {
        if (error.response?.status === 401) {
            await refreshToken();
            return sendWhatsAppTemplate(req, res); // Retry the request with the new token
        }

        console.error("WhatsApp API Error:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
};

module.exports = { sendMessage, sendWhatsAppTemplate };