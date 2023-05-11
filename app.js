const express = require("express");
const {sequelize} = require('./src/db/sequelize')
const session = require('express-session')
const morgan =require('morgan')
const favicon=require('serve-favicon')
const bodyParser=require('body-parser')
const sequelizeSession = require('connect-session-sequelize')(session.Store)

const app =express()
const port = 3000
const oneDay = 1000 * 60 * 60 * 24 

sequelize.sync({force: true}).then(()=>console.log('Synchronisation reussi'))

//session middleware
app
.use(session({
    secret:'key that will be secret',
    resave:false,
    saveUninitialized: false,
    store:new sequelizeSession({
        db:sequelize
    })
}))
.use(express.static(__dirname))
.use(favicon(__dirname + '/favicon.ico'))
.use(morgan('dev'))
.use(bodyParser.json())
.use(bodyParser.urlencoded({extended:true}))


//ici, nous placerons nos futurs points de terminaison. 
require('./src/routes/connexion')(app)  //  /api/login        
require('./src/routes/inscription')(app) //    /api/register
require('./src/routes/posts')(app)
require('./src/routes/post_ville')(app)
require('./src/routes/post_region')(app)
require('./src/routes/recherche')(app)  //   /api/search/:word  (Page de recherche selon le titre)
require('./src/routes/villes')(app)     //  /api/regions/:id   (toutes les villes d'une regions donnée)
require('./src/routes/categories')(app)     // /api/categories/:id (Pour les types ayant l'id de la catégorie)       /api/categories (Pour toutes les catégories)

app.get('/',(req,res)=>{
    console.log(req.session)
    res.send('Hello session')
})

//On ajoute la gestion des erreurs 404
app.use(({res})=>{
    const message ='Impossible de trouver la ressource demandée! vous pouvez essayer une autre URL.'
    res.status(404).json({message})
})

app.listen(port,()=>console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))