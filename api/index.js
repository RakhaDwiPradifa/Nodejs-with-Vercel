const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Middleware untuk parsing JSON
app.use(bodyParser.json());

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/sensorData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Skema untuk data sensor
const sensorSchema = new mongoose.Schema({
  sensor: String,
  value: Number,
  temperature: Number,
  humidity: Number,
});

const Sensor = mongoose.model('Sensor', sensorSchema);

// Endpoint untuk menerima data POST dari sensor
app.post('/api', async (req, res) => {
  try {
    const sensorData = new Sensor(req.body);
    await sensorData.save();
    res.status(200).json({ message: 'Data berhasil disimpan', data: req.body });
  } catch (err) {
    res.status(500).json({ message: 'Error menyimpan data', error: err });
  }
});

// Endpoint untuk mengambil data sensor
app.get('/api', async (req, res) => {
  try {
    const data = await Sensor.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data', error: err });
  }
});

// Menjalankan server
const port = 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
