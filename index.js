const express = require('express')
const bodyParser = require('body-parser')

const  _ = require('underscore')
const productos = require('./database').productos
const productosRouter = require('./api/recursos/productos/productos.routes')
const usuariosRouter = require('./api/recursos/usuarios/usuarios.routes')
const morgan = require('morgan')
const logger = require("./utils/logger")
const passport = require('passport')

const passportJWT = require('passport-jwt')
const authJWT = require('./api/libs/auth')


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


app.listen(3000, ()=>{
	logger.info("escuchando puerto 3000")
})