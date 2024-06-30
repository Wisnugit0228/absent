import express from 'express'
import axios from 'axios';
import geolib from 'geolib';

const app = express();
const PORT = process.env.PORT || 3000;
const IPINFO_TOKEN = '2e9eb14a38748b';

app.use(express.json());

// Endpoint untuk mendapatkan lokasi saat ini
app.get('/current-location', async (req, res) => {
  try {
    const response = await axios.get(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
    const locationData = response.data;
    const [latitude, longitude] = locationData.loc.split(',');

    res.json({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      city: locationData.city,
      region: locationData.region,
      country: locationData.country
    });
  } catch (error) {
    res.status(500).json({ error: 'Error getting location data' });
  }
});

// Endpoint untuk mengukur jarak
app.post('/distance', async (req, res) => {
  const { latitude: targetLat, longitude: targetLon } = req.body;

  try {
    const response = await axios.get(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
    const locationData = response.data;
    const [currentLat, currentLon] = locationData.loc.split(',');

    const distance = geolib.getDistance(
      { latitude: parseFloat(currentLat), longitude: parseFloat(currentLon) },
      { latitude: parseFloat(targetLat), longitude: parseFloat(targetLon) }
    );

    res.json({
      distance: distance, // Jarak dalam meter
      unit: 'meters'
    });
  } catch (error) {
    res.status(500).json({ error: 'Error calculating distance' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
