const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast')
const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public/');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);
// Setup static directory to serve
app.use(express.static(publicDirectoryPath)); // way to customize your server

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Chris Nosowsky',
  });
});

app.get('/about', (req, res) => [
  res.render('about', {
    title: 'About Me',
    name: 'Chris Nosowsky',
  }),
]);

app.get('/help', (req, res) => {
  res.render('help', {
    message: 'Example help message',
    title: 'Help',
    name: 'Chris Nosowsky',
  });
});

app.get('/weather', (req, res) => {
  if(!req.query.address) {
    return res.send({
      error: "Address must be provided!"
    })
  }


  geocode(req.query.address, (error, {latitude, longitude, location}) => {
    if(error) {
      return res.send({ error }) // short hand
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error })
      }

      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      })
    })
  })
});


app.get('/products', (req, res) => {
  if(!req.query.search) {
    return res.send({
      error: "you must provide a search term"
    })
  }

  console.log(req.query.search)
  res.send({
    products: []
  })
})

app.get('/help/*', (req, res) => {
  res.render('404page', {
    title: '404',
    message: 'Help article not found',
    name: 'Chris Nosowsky',
  });
});

app.get('*', (req, res) => {
  res.render('404page', {
    title: '404',
    name: 'Chris Nosowsky',
    message: '404 Page Not Found',
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
