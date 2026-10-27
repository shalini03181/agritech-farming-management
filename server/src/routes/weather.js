import { Router } from 'express';
const router = Router();
router.get('/', async (req, res) => {
  const city = String(req.query.city || 'Indore').trim();
  if (!process.env.OPENWEATHER_API_KEY) return res.json({
    source: 'demo', city, message: 'Demo data only. Add OPENWEATHER_API_KEY to server/.env for live weather.',
    temperature: 28, humidity: 55, windSpeed: 10, condition: 'Partly cloudy'
  });
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ message: data.message || 'Weather lookup failed.' });
    res.json({ source: 'live', city: data.name, temperature: data.main.temp, humidity: data.main.humidity, windSpeed: data.wind.speed, condition: data.weather?.[0]?.description || 'Unknown' });
  } catch { res.status(502).json({ message: 'Weather service is temporarily unavailable.' }); }
});
export default router;
