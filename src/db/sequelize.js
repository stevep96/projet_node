const imageModel =require('../models/image')
const userModel = require('../models/utilisateur')
const postModel = require('../models/post')
const typeModel = require('../models/type')
const villeModel = require('../models/ville')
const regionModel = require('../models/region')
const categorieModel = require('../models/categorie')
const commentaireModel = require('../models/commentaire')
const voteModel = require('../models/vote')


const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('projet-db', 'root', 'pass', {
  dialect: 'sqlite',
  host:'./projet-db.sqlite',
  define: {
    underscore:true
  },
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  logging: false
})

const post=postModel(sequelize,DataTypes)
const img=imageModel(sequelize,DataTypes)
const utilisateur = userModel(sequelize, DataTypes)
const type = typeModel(sequelize, DataTypes)
const ville = villeModel(sequelize, DataTypes)
const region = regionModel(sequelize, DataTypes)
const categorie = categorieModel(sequelize, DataTypes)
const commentaire = commentaireModel(sequelize, DataTypes)
const vote = voteModel(sequelize, DataTypes)
  

// Type foreign Key to posts table
type.hasMany(post,{
  foreignKey:'id_type',
  as: 'type_post'
})
post.belongsTo(type,{
  foreignKey: 'id_type',
  as: 'type_post'
})

//ville foreign Key to posts table
ville.hasMany(post,{
  foreignKey:'id_ville',
  as: 'ville_post'
})
post.belongsTo(ville,{
  foreignKey: 'id_ville',
  as: 'ville_post'
})

//utilisateurs foreign Key to posts table
utilisateur.hasMany(post,{
  foreignKey:'id_utilisateur',
  as: 'utilisateur_post'
})
post.belongsTo(utilisateur,{
  foreignKey: 'id_utilisateur',
  as: 'utilisateur_post'
})

// Region foreign Key to villes table
region.hasMany(ville,{
  foreignKey:'id_ville',
  as: 'region'
})
ville.belongsTo(region,{
  foreignKey: 'id_ville',
  as: 'region'
})

// Categorie foreign Key on Types table
categorie.hasMany(type,{
  foreignKey:'id_cat',
  as: 'categories'
})
type.belongsTo(categorie,{
  foreignKey: 'id_cat',
  as: 'categories'
})

module.exports = { 
 sequelize, utilisateur, post, img, type, ville, region, categorie, commentaire, vote
}