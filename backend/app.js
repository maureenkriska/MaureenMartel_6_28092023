// Import du framework Express
const express = require('express')

// Import de mongoose
const mongoose = require('mongoose')

// Création de l'application Express
const app = express()




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

// Import de mon application
module.exports = app