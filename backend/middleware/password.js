const Password = require('../models/password')

module.exports = (req, res, next) => {
  if (!Password.validate(req.body.password)) {
    res.status(400).json({ 
     message: "Votre mot de passe doit être plus fort et contenir une majuscule, une minuscule, un chiffre, contenir entre 4 et 16 caractères et ne doit pas contenir d'espace ni de caractères spéciaux"
    })
  } else {
    next()
  }
}