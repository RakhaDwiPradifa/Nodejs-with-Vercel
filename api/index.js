const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
app.use(express.json());  // Untuk parsing JSON

// Gunakan CORS middleware
app.use(cors()); // Mengizinkan semua permintaan, untuk keamanan lebih baik diubah menjadi domain tertentu

const dbURI = process.env.MONGODB_URI || "mongodb+srv://rakha-dev:Rakhadwip14@iotrakhadev.mdt0f.mongodb.net/sensor_database?retryWrites=true&w=majority&appName=IotRakhaDev";
let isConnected = false;

// Fungsi untuk menyambungkan ke MongoDB
async function connectToDatabase() {
    if (isConnected) return;
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    isConnected = true;
    console.log("MongoDB connected successfully");
}

// Skema MongoDB untuk data sensor
const sensorSchema = new mongoose.Schema({
    sensor: { type: String, required: true }, // Jenis sensor
    value: { type: Number },                 // Nilai sensor
    temperature: { type: Number },           // Suhu sensor (jika relevan)
    humidity: { type: Number },              // Kelembaban sensor (jika relevan)
    timestamp: { type: Date, default: Date.now } // Waktu perekaman data
});

// Model MongoDB menggunakan skema 'sensorSchema'
const Sensor = mongoose.model('Sensor', sensorSchema);

// Endpoint API untuk menangani request HTTP
module.exports = async (req, res) => {
    await connectToDatabase();

    if (req.method === "POST") {
        try {
            const { sensor, value, temperature, humidity } = req.body;

            // Validasi data dari request
            if (!sensor || value === undefined) {
                return res.status(400).json({ error: "Data tidak lengkap" });
            }

            // Membuat data baru di database
            const newSensorData = new Sensor({ sensor, value, temperature, humidity });
            await newSensorData.save();

            res.status(200).json({ message: "Data berhasil disimpan", data: newSensorData });
        } catch (error) {
            console.error("Error while saving data:", error);
            res.status(500).json({ error: "Gagal menyimpan data" });
        }
    } else if (req.method === "GET") {
        try {
            // Mengambil semua data dari koleksi sensor
            const data = await Sensor.find();

            res.status(200).json(data);
        } catch (error) {
            console.error("Error while retrieving data:", error);
            res.status(500).json({ error: "Gagal mengambil data" });
        }
    } else {
        // Method selain POST dan GET tidak diizinkan
        res.status(405).json({ error: "Method tidak diizinkan" });
    }
};

// Inisialisasi server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
