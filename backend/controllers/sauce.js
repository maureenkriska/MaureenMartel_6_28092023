const Sauce = require('../models/sauce')
const fs = require('fs') // Va me permettre de gérer des fichiers (écriture, suppression de fichiers)

//Petite fonction à appeler lorsque une image est captée, mais la BDD n'est pas modifiée.
function deletePreloadedPicture(req) {
  fs.unlink(`images/${req.file.filename}`, () => console.log(`${req.file.filename} a été supprimée, car la modification de la BDD n'a pas été effectuée`))
}

exports.getAllSauces= (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(500).json({ message:'Echec lors de la recherche de sauces dans la base de données', error }))    
}

exports.getOneSauce = ( req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ message:"Echec lors de la recherche d'une sauce particulière", error }))    
}

exports.createSauce = (req, res, next) => {
  if (req.file) {
    if (req.body.name && req.body.manufacturer && req.body.description
    && req.body.mainPepper && req.body.heat) {
      const sauceObject = {
        ...req.body,
        userId: req.auth.userId
      }
      const sauce = new Sauce({
        ...sauceObject,
        imageURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //Récupération du chemin de fichier via multer
        likes: 0, //Paramètres de l'objet sauce non présents dans la requête initiale
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
      })
      console.log(sauce)
      sauce.save()
        .then(() => res.status(201).json({ message : 'Sauce enregistrée' }))
        .catch((error) => {
          deletePreloadedPicture(req)  
          res.status(500).json({ message:"La sauce n'a pas pu être enregistrée", error })
        })
    } else {
      deletePreloadedPicture(req)
      res.status(400).json({ message: "Il manque des informations pour enregistrer une sauce"})
    }
    
  } else {
    res.status(400).json({ message: "Merci d'intégrer une image à votre sauce"})
  }    
}

exports.updateSauce = (req, res, next) => {
  if (req.file) { //Si ma requête contient une image issue de form-data => propriété file de l'objet requête créée par le middleware multer
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (req.auth.userId === sauce.userId) { // Je vérifie que ce soit bien le propriétaire de la sauce qui veux faire la modification
          const sauceObject = {
            ...req.body,
            imageURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //Récupération du chemin de fichier via multer
          }
          const filename = sauce.imageURL.split('/images/')[1]
          fs.unlink(`images/${filename}`, () => {
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
              .catch((error) => {
                deletePreloadedPicture(req)
                res.status(400).json({ message: "Votre modification n'a pas pu être effectuée", error })
              })
          })
        } else {
          res.status(403).json({ message: 'Requête refusée, seul le créateur de la sauce peut la modifier' })
        }
      })
      .catch((error) => {
        deletePreloadedPicture(req)
        res.status(404).json({ message: "La sauce à modifier n'a pas été trouvée", error })
      })
  } else {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (req.auth.userId === sauce.userId) { // Je vérifie que ce soit bien le propriétaire de la sauce qui veux faire la modification
          const sauceObject = { ...req.body }
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message : 'Sauce modifiée'}))
            .catch(error => res.status(400).json({ message : "La sauce n'a pas pu être modifiée", error }))
        } else {
          res.status(403).json({ message: 'Requête refusée, seul le créateur de la sauce peut la modifier' })  
        }          
      })
      .catch(error => res.status(404).json({ message: "La sauce à modifier n'a pas été trouvée", error }))
  }
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (req.auth.userId === sauce.userId) {  //Je vérifie que ce soit bien le propriétaire de la sauce qui veux faire la modification
        const filename = sauce.imageURL.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
          console.log(`${filename} supprimée`)
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(204).json({ message: 'Sauce retirée et image détruite' }))
            .catch(error => res.status(400).json({ message: "La sauce n'a pas pu être supprimée", error }))   
        })
      } else {
        res.status(403).json({ message: 'Requête refusée, seul le créateur de la sauce peut la supprimer' })
      }
    })
    .catch(error => res.status(404).json({ message: "La sauce à supprimer n'a pas été trouvée", error }))   
}

exports.likeStatus = (req, res, next) => {
  const sauceId = req.params.id
  const userId = req.auth.userId // Je récupère l'userId depuis son token et non depuis le body
  Sauce.findOne({ _id: sauceId })
    .then(sauce => {
      let likes = sauce.likes
      let dislikes = sauce.dislikes
      switch (req.body.likeStatus) {
        case 1:
          if (!sauce.usersLiked.includes(userId)) { // Si mon ID n'est pas dans le tableau usersLiked => Je n'ai pas encore liké la sauce
            sauce.usersLiked.push(userId)           // J'ajoute mon ID dans le tableau
            likes = likes + 1                       // Je comptabilise le like
          }
          if (sauce.usersDisliked.includes(userId)) { // Si mon ID est dans le tableau des usersDisliked => je n'aimais pas la sauce, je dois m'enlever, je suis en train de la liker
            const userIndex = sauce.usersDisliked.indexOf(userId) // Je récupère l'index de mon id dans le tableau
            sauce.usersDisliked.splice(userIndex, 1) // J'enlève mon ID avec splice, à mon index, et 1 seule entrée à supprimer
            dislikes = dislikes - 1                 // Si je like, je ne peux plus dislike => dislikes - 1
          }
          const sauceObjectLike = {
            likes: likes,
            dislikes: dislikes,
            usersLiked: sauce.usersLiked,
            usersDisliked: sauce.usersDisliked
          }
          Sauce.updateOne({ _id: sauceId }, { ...sauceObjectLike, _id: sauceId})
            .then(() => res.status(200).json({ message : 'Votre like a bien été ajouté' }))
            .catch(error => res.status(400).json({ message: "Votre like n'a pas pu être supprimé", error }))   
          break // Me permet de mettre fin à l'instruction en cours à fin de ne pas rentrer dans les instructions suivantes
        case 0:
          if (sauce.usersLiked.includes(userId)) {  //Je vérifie que je suis dans le tableau des likes => Si oui, modification des likes et du tableau
            const userIndex = sauce.usersLiked.indexOf(userId)
            sauce.usersLiked.splice(userIndex, 1)
            likes = likes -1
          }
          if (sauce.usersDisliked.includes(userId)) { //Je vérifie que je suis dans le tableau des dislikes et si oui, je modifie le compteur et le tableau
            const userIndex = sauce.usersDisliked.indexOf(userId)
            sauce.usersDisliked.splice(userIndex, 1)
            dislikes = dislikes -1
          }
          const sauceObject = {
            likes: likes,
            dislikes: dislikes,
            usersLiked: sauce.usersLiked,
            usersDisliked: sauce.usersDisliked
          }
          Sauce.updateOne({ _id: sauceId}, { ...sauceObject, _id: sauceId })
            .then(() => res.status(200).json({ message : 'Votre like ou dislike a bien été annulé' }))
            .catch(error => res.status(400).json({ message: "Votre like ou dislike n'a pas été annulé", error }))   
          break // Me permet de mettre fin à l'instruction en cours à fin de ne pas rentrer dans les instructions suivantes
        case -1:
          if (!sauce.usersDisliked.includes(userId)) {  //Si je n'appartiens pas déjà au tableau des dislikes,
            sauce.usersDisliked.push(userId)            //alors je m'ajoute,
            dislikes = dislikes +1                      //et je modifie le compteur des dislikes
          }
          if (sauce.usersLiked.includes(userId)) {              //Si j'appartiens au tableau des likes,
            const userIndex = sauce.usersLiked.indexOf(userId)  //je récupère l'index de mon ID,
            sauce.usersLiked.splice(userIndex, 1)               //pour m'enlever du tableau,
            likes = likes -1                                    //et je réduis le compteur de like
          }
          const sauceObjectDislike = {
            likes: likes,
            dislikes: dislikes,
            usersLiked: sauce.usersLiked,
            usersDisliked: sauce.usersDisliked,
          }
          Sauce.updateOne({ _id: sauceId}, {...sauceObjectDislike, _id: sauceId})
            .then(() => res.status(200).json({ message: 'Votre dislike a bien été ajouté' }))
            .catch(error => res.status(400).json({ message: "Votre dislike n'a pas été ajouté", error }))  
          break // Me permet de mettre fin à l'instruction en cours à fin de ne pas rentrer dans les instructions suivantes
        default:
          res.status(400).json({ message: 'Mauvaise requête' })
          break // Me permet de mettre fin à l'instruction en cours à fin de ne pas rentrer dans les instructions suivantes
      }
    })
    .catch(error => res.status(404).json({ message: "La sauce demandée n'a pas été trouvée", error }))  
  }