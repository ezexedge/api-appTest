
const express = require('express')
const bodyParser = require('body-parser')
const  _ = require('underscore')
const morgan = require('morgan')
const passport = require('passport')
const passportJWT = require('passport-jwt')
const mongoose =  require('mongoose')
//separar modulos

//separar archvos  SIEMPRE!!!!!!!!!!!
const authJWT = require('./api/libs/auth')
const config = require('./config/index')
const productosRouter = require('./api/recursos/productos/productos.routes')
const usuariosRouter = require('./api/recursos/usuarios/usuarios.routes')
const logger = require("./utils/logger")
const productos = require('./database').productos


mongoose.connect('mongodb://127.0.0.1:27017/vendetuscorotos')
mongoose.connection.on('error',()=>{
	logger.error("fallo la conexion a mongodb")
	process.exit(1)
})

const app = express()
app.use(bodyParser.json())
app.use(morgan('short',{
	stram : {
		write: message => logger.info(message.trim())
	}
}))



passport.use(authJWT)

app.use(passport.initialize())


app.use('/productos',productosRouter)
app.use('/usuarios',usuariosRouter)

app.get('/', passport.authenticate('jwt', {
	session : false
}) ,(req,res)=>{
	logger.info(req.user)
	res.send('api vende tus corotos')
})


app.listen(config.puerto, ()=>{
	logger.info("escuchando puerto 3000")
})