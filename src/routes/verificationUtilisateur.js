const {utilisateur} = require('../db/sequelize')
const {verificationUtilisateur} = require('../db/sequelize')
const auth = require('../auth/isAuth')

module.exports = (app) => {
  app.post('/api/validation/:id', auth,(req, res) => {
    verificationUtilisateur.findAll({where: {id_utilisateur:req.params.id}})
       .then(verification => {
         if(verification.token != req.body.token){
            if(verification.date_expiration > Date.now()){
                const message = 'La liste des posts a bien été récupérée.'
                res.status(200).json({ message, data: verification })
            }else{
                message=`Désolé votre token a expiré veuillez recharcher un nouveau`
                res.status(500).json({message, data:error})
             }

         }else{
            message=`Désolé votre Token de vérification est incorrect`
            res.status(500).json({message, data:error})
         }
       })
       .catch(error => {
         const message = `Nous n'arrivons pas à acceder au token désolé`
         res.status(500).json({message, data:error})
         console.log(error)
       })
   })
}