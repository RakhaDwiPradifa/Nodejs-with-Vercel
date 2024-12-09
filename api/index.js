require('dotenv').config(); // Memuat variabel lingkungan dari .env
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Inisialisasi aplikasi
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Koneksi ke MongoDB Atlas
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Skema MongoDB
const sensorSchema = new mongoose.Schema({
    sensor: String,
    value: Number,
    temperature: Number,
    humidity: Number,
    timestamp: { type: Date, default: Date.now }
});
const Sensor = mongoose.model('Sensor', sensorSchema);

// Route untuk menerima data sensor (POST)
app.post('/api/sensor', async (req, res) => {
    try {
        const { sensor, value, temperature, humidity } = req.body;

        if (!sensor) {
            return res.status(400).json({ error: 'Sensor type is required' });
        }

        const data = new Sensor({ sensor, value, temperature, humidity });
        await data.save();

        res.status(201).json({ message: 'Sensor data saved successfully', data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Route untuk mengambil data sensor (GET)
app.get('/api/sensor', async (req, res) => {
    try {
        const data = await Sensor.find().sort({ timestamp: -1 }).limit(100);
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

// Route untuk menghapus data lebih dari 30 hari
app.delete('/api/sensor/cleanup', async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const result = await Sensor.deleteMany({ timestamp: { $lt: thirtyDaysAgo } });

        res.status(200).json({ message: `${result.deletedCount} old records deleted` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to cleanup data' });
    }
});

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to Sensor API');
});

// Menjalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
