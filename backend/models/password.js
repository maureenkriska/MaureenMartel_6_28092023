// passwordValidator me permet de mettre des contraintes et des conditions lors de la création du mot de passe.
const pwdValidator = require('password-validator')
const pwdSchema = new pwdValidator()

pwdSchema
.is().min(4)            // Minimum 4 caractères
.is().max(16)           // Maximum 16 caractères
.has().uppercase()      // Contient au moins une majuscule
.has().lowercase()      // Contient au moins une minuscule
.has().digits()         // Contient au moins un chiffre
.has().not().spaces()   // Ne dois pas contenir d'espaces

module.exports = pwdSchema