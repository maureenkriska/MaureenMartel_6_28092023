const multer = require('multer')

const MIME_TYPES = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',  
}

const storage = multer.diskStorage({        // Contient la logique pour indiquer à multer où enregistrer les fichiers entrants
  destination: (req,file,callback) => {     // Destination indique à multer d'enregistrer les fichiers dans le dossier images
    callback(null, 'images')
  },
  filename: (req,file,callback) => {                      // Filename indique à multer d'utiliser le nom d'origine,
    const name = file.originalname.split(' ').join('_')   // de remplacer les espaces par des underscores,
    const extension = MIME_TYPES[file.mimetype]           // d'insérer l'extension de fichier appropriée,
    callback(null, name + Date.now() + '.' + extension)   // et d'ajouter un timestamp comme nom de fichier.
  }
})


// Exportation de multer configuré et indication de générer uniquement les téléchargements de fichiers image
module.exports = multer({storage: storage}).single('image')