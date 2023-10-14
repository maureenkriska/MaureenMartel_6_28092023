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
    .catch(error => res.status(500).json({ error }))
}

//exports.login = (req, res, next) => {}