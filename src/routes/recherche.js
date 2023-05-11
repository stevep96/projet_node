const Sequelize = require('sequelize')
const { post } = require('../db/sequelize')
const {type} = require('../db/sequelize')
const {ville} = require('../db/sequelize')
const {utilisateur} = require('../db/sequelize')
const Op = Sequelize.Op;
module.exports = (app) => {
  app.get('/api/search/:word', (req, res) => {
   post.findAll({
      include:[{
        model:type,
        as:'type_post'
      },
      {
        model:ville,
        as:'ville_post'
      },
      {
        model:utilisateur,
        as:'utilisateur_post'
      }],
      where: {
        titre: {
          [Op.like]: `%${req.params.word}%`
        }
      }
  })
      .then(posts => {
        const message = 'La liste des posts a bien été récupérée.'
        res.json({ message, data: posts })
      })
      .catch(error => {
        const message = `La liste des posts n'a pas pu être récupérée. Réessayez dans quelques instants.`
        res.status(500).json({message, data:error})
        console.log(error)
      })
  })
}