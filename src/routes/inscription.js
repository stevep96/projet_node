const { utilisateur } = require('../db/sequelize')
const { ValidationError } = require('sequelize')
const {verificationUtilisateur} = require('sequelize')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const {v4: uuidv4} = require('uuid')
require('dotenv').config()


let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS
  }
})  
module.exports = (app) => {
  app.post('/api/register', async(req, res) => {
    if(req.body.pass){
      const salt = await bcrypt.genSalt(10)
      newPass=await bcrypt.hash(req.body.pass, salt)
      req.body.pass = newPass
    }
    const token = uuidv4()
    req.body.role = "utilisateur"
    req.body.verifier = 0
    req.body.token = token
    req.body.creationToken=Date.now()
    req.body.expirationToken=Date.now() + 27600000
    //creation du nouvel utilisateur
    
    utilisateur.create(req.body)
      .then(utilisateur => {
        
        const message = `l'utilisateur ${utilisateur.nom} a bien été crée.`
        
          // Envoi du mail au nouvel utilisateur
          
          const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: utilisateur.email,
            subject: "Vérification de votre adresse mail",
            html: `<p>Vérifiez votre mail pour completer votre enregistremt.</p>
            <p> Lien de vérification <b> expire dans 1h </b>.</p>
            <p><h1>${token} </h1></p>`
          }
          transporter.sendMail(mailOptions).then(()=>{
            console.log('Lien de vérification envoyé avec succès')
            res.status(200).json({message, data: utilisateur})
            req.session.user = utilisateur
          }).catch((error)=>{
            console.log(error)
            const message = `Erreur lors de l'envoi du mail`
            res.status(500).json({message, data: error})
          })

          
          
      })
      .catch(error => {
        if(error instanceof ValidationError){
          return res.status(400).json({message: error.message, data: error})
        }
        const message = `L'utilisateur n'a pu être créé. Réessayez dans quelques instants.`
        res.status(500).json({message, data: error})
        console.log(error)
      })
  })
/*
  let userverfification = {
    token: token,
    id_utilisateur: utilisateur.id_utilisateur,
    date_expiration: Date.now() + 21600000
  }
  
  // remplissage de la table de vérification

  verificationUtilisateur.create(userverfification).then(()=>{

    // Envoi du mail au nouvel utilisateur

    
  }).catch((error)=>{
    message = `Une érreur s'est produite lors de la sauvegarde de votre token`
    return res.status(400).json({message: message, data: error})    
  })
*/
}

/*
const sendVerificationEmail=({_id, email}, res) =>{
  const currentUrl = "http://localhos:3000/api"
  const uniqueString = uuidv4() + _id
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Vérification de votre adresse mail",
    html: `<p>Vérifiez votre mail pour completer votre enregistremt.</p>
    <p> Lien de vérification <b> expire dans 1h </b>.</p>
    <p>appuyez <a href=${currentUrl + "/verification/" + _id + "/" + uniqueString}>ici </a> pour verifier</p>`
  }

  const saltRounds =10
  bcrypt.hash(uniqueString, saltRounds).then((hashedUniqueString)=>{
    const userverfification = new verificationUtilisateur({
      token: hashedUniqueString,
      id_utilisateur: _id,
      date_expiration: Date.now() + 3600,
      date_creation: Date.now()
    })
    verificationUtilisateur.create(userverfification).then(()=>{
      transporter.sendMail(mailOptions).then(()=>{
        console.log('Lien de vérification envoyé avec succès')
      }).catch((error)=>{
        console.log(error)
        const message = `Erreur lors de l'envoi du mail`
        res.status(500).json({message, data: error})
      })
    })
    .catch((error)=>{
      console.log(error)
      const message = `Erreur lors de l'entregistrement de votre token`
      res.status(500).json({message, data: error})
  })
  }).catch((error)=>{
    console.log(error)
    const message = `Erreur de création de votre token`
    res.status(500).json({message, data: error})
  })
}
*/