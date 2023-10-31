// Import des frameworks et divers plugin
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const cors = require('cors')

// Import de dotenv
const dotenv = require("dotenv")
dotenv.config()

// Appel de ma BDD
const MONGOBD_USER = process.env.MONGOBD_USER

// Import de mon router User
const userRoutes = require('./routes/user')

const app = express()

// Je limite le nombre de requêtes faisables par un même terminal, selon mes critères
const limiter = rateLimit({
  windowMs: 15*60*1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
})

// Connexion à mon cluster MongoDB
mongoose.connect(MONGOBD_USER, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use(express.json())

app.use('/images', express.static(path.join(__dirname, 'images')))

// Partage de ressource entre origines multiples
app.use(cors())

// Je configure les headers HTTP, je nettoie les requêtes, et enlève les caractères spéciaux ou autorise les points pour les emails
app.use(helmet({crossOriginEmbedderPolicy: false}))
app.use(limiter)
app.use(mongoSanitize({
  allowDots: true
}))

app.use('/api/auth', userRoutes)
//app.use('/api/sauces', sauceRoutes) 

// Import de mon application
module.exports = app