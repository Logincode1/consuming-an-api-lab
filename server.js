const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

// Middleware to get req data into the req.body
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/weather/show", (req, res) => {
  res.render("./weather/show.ejs", {
    weather: req.query.weather
  });
});

app.post("/weather", async (req, res) => {
  //obtain the zip code from the request body.
  const zip = req.body.zip;
  const apiKey = process.env.API_KEY;
  //Use the zip code and API key to make a request to the Open Weather Map API.
  const weatherReq = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&appid=${apiKey}`
  );
  const weatherData = await weatherReq.json();
  //Once the weather data is received, redirect to the /weather/show route with the weather data.
  res.redirect(`/weather/show?weather=${weatherData.main.temp}`);
});

app.listen(3000, () => {
  console.log("Listening on 3000...");
});
