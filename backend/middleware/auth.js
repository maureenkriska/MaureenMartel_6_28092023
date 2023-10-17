const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY

module.exports = (req,res,next) => { // Pour prevenir tout type de problème, j'insère le tout dans un bloc try...catch
  try {
    const token = req.headers.authorization.split(' ')[1] // J'utilise la fonction split pour tout récupèrer après l'espace dans le header
    const decodedToken = jwt.verify(token, SECRET_KEY)    // J'utilise la fonction verify pour décoder mon token
    const userId = decodedToken.userId                    // J'extraie l'ID user de mon token et l'ajoute à l'objet request
    req.auth = {
      userId: userId
    }
    next()
  } catch(error) {
    res.status(401).json({ error })
  }
}