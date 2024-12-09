const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI || "mongodb+srv://rakha-dev:Rakhadwip14@iotrakhadev.mdt0f.mongodb.net/sensor_database?retryWrites=true&w=majority&appName=IotRakhaDev";
let isConnected = false;

async function connectToDatabase() {
    if (isConnected) return;
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    isConnected = true;
    console.log("MongoDB connected successfully");
}

/**
 * Schema untuk data sensor:
 * - gasLevel (Number): Nilai tingkat gas dari sensor MQ135
 * - timestamp (Date): Waktu perekaman data, default saat ini
 */
const sensorSchema = new mongoose.Schema({
    gasLevel: Number,
    timestamp: { type: Date, default: Date.now }
});

// Model MongoDB yang menggunakan schema 'sensorSchema'
// Catatan: Nama koleksi adalah "sensor_data"
const SensorData = mongoose.model('mq135', sensorSchema);

/**
 * Endpoint untuk menangani request HTTP
 * - Method:
 *    - POST: Menyimpan data sensor baru
 *    - GET: Mengambil semua data sensor
 */
module.exports = async (req, res) => {
    await connectToDatabase();

    if (req.method === "POST") {
        try {
            const { gasLevel } = req.body;

            // Validasi data dari request
            if (gasLevel === undefined) {
                return res.status(400).json({ error: "Data tidak lengkap" });
            }

            // Membuat data baru di database
            const newSensorData = new SensorData({ gasLevel });
            await newSensorData.save();

            res.status(200).json({ message: "Data berhasil disimpan" });
        } catch (error) {
            console.error("Error while saving data:", error);
            res.status(500).json({ error: "Failed to save data" });
        }
    } else if (req.method === "GET") {
        try {
            // Mengambil semua data dari koleksi sensor_data
            const data = await SensorData.find();

            res.status(200).json(data);
        } catch (error) {
            console.error("Error while retrieving data:", error);
            res.status(500).json({ error: "Failed to retrieve data" });
        }
    } else {
        // Method selain POST dan GET tidak diizinkan
        res.status(405).json({ error: "Method not allowed" });
    }
};