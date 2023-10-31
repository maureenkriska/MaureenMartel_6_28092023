// passwordValidator me permet de mettre des contraintes et des conditions lors de la création du mot de passe.
const pwdValidator = require('password-validator')
const pwdSchema = new pwdValidator()

pwdSchema
.is().min(4)            // Minimum 4 caractères
.is().max(16)           // Maximum 16 caractères
.has().uppercase()      // Contient une ou plusieurs majuscules
.has().lowercase()      // Contient une ou plusieurs minuscules
.has().digits()         // Contient un ou plusieur chiffres
.has().not().spaces()   // Ne dois pas contenir d'espaces

module.exports = pwdSchema