const express = require('express');
const router = express.Router();
const axios = require('axios');
const { ensureAuthenticated } = require('../config/auth');
router.get('/exchange-rate', ensureAuthenticated, async (req, res) => 
{
try {
    const dates = [
      { year: 2023, month: 10, day: 1 },
      { year: 2023, month: 10, day: 7 },
      { year: 2023, month: 10, day: 15 }
    ];
    const formattedDates = dates.map(date => 
    {
      return 
      {
        year: date.year,
        month: String(date.month).padStart(2, '0'),
        day: String(date.day).padStart(2, '0')
      };
    });
    const promises = formattedDates.map(({ year, month, day }) => 
    {
      const url = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/history/USD/${year}/${month}/${day}`;
      return axios.get(url);
    });
    const results = await Promise.all(promises);
    const rates = results.map((result, index) => 
      {
      if (result.data.result !== 'success') {
        return null;
      }
      return 
      {
        date: `${formattedDates[index].year}-${formattedDates[index].month}-${formattedDates[index].day}`,
        rate: result.data.conversion_rates ? result.data.conversion_rates.EUR : null
      };
    }).filter(rate => rate !== null && rate.rate !== null);
    res.render('exchange-rate', { rates: rates.length > 0 ? rates : null });
  } catch (err) {
    console.error('Error fetching exchange rates:', err);
    res.status(500).send('Server Error');
  }
});
router.get('/pokemon', ensureAuthenticated, (req, res) => 
{
  const url = 'https://pokeapi.co/api/v2/pokemon/ditto';
  axios.get(url).then(response => {
    res.render('pokemon', { data: response.data });
  }).catch(err => {
    console.error('Error fetching Pokemon data:', err);
    res.status(500).send('Server Error');
  });
});
module.exports = router;