const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connect = require('./config/db');
const cookieParser = require('cookie-parser');
const swaggerSetup = require('./swagger');
const app = express();

swaggerSetup(app);

// Import routes
const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const gymRoutes = require('./routes/gymRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const salaryRoutes=require('./routes/salaryRoutes');
const dashboardRoutes=require('./routes/dashboardRoutes');
const whatsappRoutes=require('./routes/whatsappRoutes');
const leadRoutes=require('./routes/leadRoutes');
// Setup env variables
dotenv.config({ path: '.env.development' });

const stripe = require('stripe')(process.env.STRIPE_SECRET);
// Setup middlewares
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:3000',
];
// Set up middlewares
app.use(cors({
    origin: '*',
    credentials: true
}));


// Connect to database
connect();


// Setup routes
app.use('/', homeRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', activityRoutes);
app.use('/api', membershipRoutes);
app.use('/api', gymRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', paymentRoutes);
app.use('/api', salaryRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', whatsappRoutes);
app.use('/api', leadRoutes);

// encryption and decryption
const AesEncryption = require('aes-encryption');
const aes = new AesEncryption();
aes.setSecretKey(process.env.AES_SECRET_KEY);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port http://localhost:${port}`));

