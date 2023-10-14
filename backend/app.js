// Import du framework Express
const express = require('express')

// Import de mongoose
const mongoose = require('mongoose')

// Création de l'application Express
const app = express()

// Import de dotenv
const dotenv = require("dotenv")
dotenv.config()

// Appel de ma BDD
const MONGOBD_USER = process.env.MONGOBD_USER

// Connexion à mon cluster MongoDB
mongoose.connect(MONGOBD_USER, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use((req, res, next) => {
  console.log('Requête reçue')
  next()
})

app.use((req, res, next) => {
  res.status(201)
  next()
})

//Configuration d'une réponse simple (test du serveur Node, voir s'il gére correctement mon appli Express)
app.use((req, res, next) => {
  res.json({ message: 'Votre requête a bien été reçue'})
  next()
})

app.use((req, res) => {
  console.log('Réponse envoyée avec succès')
})

// Import de mon router User
const userRoutes = require('./routes/user')


app.use('/api/auth', userRoutes)
//app.use('/api/sauces', sauceRoutes) 

// Import de mon application
module.exports = app