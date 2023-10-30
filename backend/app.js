// Import du framework Express
const express = require('express')

// Import de mongoose
const mongoose = require('mongoose')

// Création de l'application Express
const app = express()

const path = require('path')

// Import de dotenv
const dotenv = require("dotenv")
dotenv.config()

app.use(express.json())

app.use('/images', express.static(path.join(__dirname, 'images')))

// Appel de ma BDD
const MONGOBD_USER = process.env.MONGOBD_USER

// Connexion à mon cluster MongoDB
mongoose.connect(MONGOBD_USER, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

// Import de mon router User
const userRoutes = require('./routes/user')


app.use('/api/auth', userRoutes)
//app.use('/api/sauces', sauceRoutes) 

// Import de mon application
module.exports = app