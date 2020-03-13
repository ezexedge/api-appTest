const express = require('express')
const bodyParser = require('body-parser')

const  _ = require('underscore')
const productos = require('./database').productos
const productosRouter = require('./api/recursos/productos/productos.routes')
const winston = require('winston')



const incluirFecha  = winston.format((info) => {
	info.message = `${new Date().toISOString()} ${info.message}`
	return info
})

const logger = winston.createLogger({
	transports : [
	new winston.transports.Console({
		level: 'debug',
		handleExceptions: true,
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.simple()
			)

	}),
	new winston.transports.File({
		level: 'info',
		handleExceptions: true,
		format: winston.format.combine(
			incluirFecha(),
			winston.format.simple()
			),
		maxsize: 5120000, // 5mb
		maxFiles : 5,
		filename: `${__dirname}/logs-de-aplicacion.log`

	})
	]
})

//winston
logger.info("hola ")
logger.error("exploto")

const app = express()
app.use(bodyParser.json())

app.use('/productos',productosRouter)




app.listen(3000, ()=>{
	console.log('puerto 3000')
})