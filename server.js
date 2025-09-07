const dotenv = require("dotenv");
const { name } = require("ejs");
dotenv.config();
const express = require("express");
const app = express();

// Middleware to get req data into the req.body
app.use(express.urlencoded({ extended: true }));


app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/weather/show", (req, res) => {
  res.render("./weather/show.ejs", {
    weather: req.query.weather,
    description: req.query.description,
    name: req.query.city,
  });
});

app.post("/weather", async (req, res) => {
  const zip = req.body.zip;
  const apiKey = process.env.API_KEY;
  const weatherReq = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&appid=${apiKey}`
  );
  const weatherData = await weatherReq.json();
  if (weatherData.main && weatherData.weather && weatherData.weather[0]) {
    res.redirect(`/weather/show?weather=${weatherData.main.temp}&city=${weatherData.name}&description=${weatherData.weather[0].description}`);
  } else {
    res.redirect(`/weather/show?weather=Error&city=Unknown&description=Could not fetch weather data`);
  }
});

app.listen(3000, () => {
  console.log("Listening on 3000...");
});
