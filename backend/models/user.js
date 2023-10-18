// Appel de mongoose
const mongoose = require('mongoose')

// Installation de Mongoose Unique Validator pour limiter les comptes avec la même adresse mail
const uniqueValidator = require('mongoose-unique-validator')

// Création de mon schéma de données utilisateurs
const userSchema = mongoose.Schema({
  // Utilisation de unique pour m'assurer que deux utilisateurs ne puissent pas créer un compte avec la même adresse mail
  email : { type: String, required: true, unique: true }, 
  password : { type: String, required: true }
})

userSchema.plugin(uniqueValidator)

// Export de mon modèle
module.exports = mongoose.model('User', userSchema)