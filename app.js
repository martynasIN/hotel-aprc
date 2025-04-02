const express = require('express');
const hotelRoutes = require('./routes/hotelRoutes')
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require("./routes/reviewRoutes");


const app = express();
app.use(express.json())

//Routes
app.use('/api/v1/hotels', hotelRoutes)
app.use('/api/v1/reviews', reviewRoutes)
app.use('/api/v1/users', userRoutes)

module.exports = app;