const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) //Fonction hachage de bcrypt, salage du mdp 10 fois
    .then(hash => {
      const user = new User({
        email:req.body.email,
        password: hash
      })
      user.save()
        .then(() => res.status(201).json({message: 'Utilsateur créé!'})) // Création du user et enregistrement dans ma BDD
        .catch(error => res.status(400).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user) {
        // J'utilise mon modèle pour vérifier si l'email entré par l'utilisateur correspond a un user existant de ma BDD
        return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect'}) 
        // Si ce n'est pas le cas, j'envoie une erreur 401 Unauthorized, sinon je continue :
      }
      // J'utilise la fonction compare pour comparer le mdp entré par l'utilisateur avec le hash enregistré dans ma BDD
      bcrypt.compare(req.body.password, user.password)
        .then((valid) => {
          if(!valid) {
          // S'ils ne correspondent pas => Erreur 401 Unauthorized
            return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect'})
          }
          // S'ils correspondent j'envoie une réponse 200 contenant l'ID user et un token
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(            // J'utilise la fonction sign de jsonwebtoken pour chiffrer un nouveau token
                { userId: user._id },   // Mon token contient l'ID de mon utilisateur
                SECRET_KEY,             // Je crypte mon token
                { expiresIn: '24h' }    // Mon utilisateur devra se reconnecter au bout de 24h
            )
          })
        })
        .catch((error) => res.status(500).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}
