const express = require("express")
const _ = require("underscore")
const uuid = require('uuid/v4')
const Joi = require('joi')
const bcrypt  = require("bcrypt")
const jwt = require("jsonwebtoken")



const usuariosController = require('./usuarios.controller')
const validarUsuario = require('./usuarios.validate').validarUsuario
const validarPedidoDeLogin = require('./usuarios.validate').validarPedidoDeLogin
const log = require("../../../utils/logger")
const usuarios = require('../../../database').usuarios
const config = require('../../../config')


const usuariosRouter = express.Router()

usuariosRouter.get('/',(req,res)=>{
	usuariosController.obtenerUsuarios()
		.then(usuarios => {
			res.json(usuarios)
		})
		.catch(err => {
			log.error("error a obtener todos los usuarios",err)
			res.sendStatus(500)
		})
})

usuariosRouter.post('/',validarUsuario,(req,res)=>{
	let nuevoUsuario = req.body


	usuariosController.usuarioExiste(nuevoUsuario.username , nuevoUsuario.email)
		.then(usuarioExiste => {
			if(usuarioExiste){
				log.warn(`el usuario de nombre  ${nuevoUsuario.username} y de email : ${nuevoUsuario.email}`)
				//el status 409 signfica estado de conflicto
				res.status(409).send('el usuario con ese email y username ya estan registrados')
				return
			}

			bcrypt.hash(nuevoUsuario.password,10,(err,hashedPassword)=>{
				if(err){
					log.error("error al tratar de hashear",err)
					res.status(500).send('error procesando creacion del usuario')
					return

				}

				usuariosController.crearUsuario(nuevoUsuario,hashedPassword)
					.then(nuevoUsuario =>{
						res.status(201).send("usuario creado exitosamente")
					})
					.catch(err =>{
						log.error("error al querer crear un usuario")
						res.status(500).send("error al querer crear un usuario")
					})

			})
		})

})


usuariosRouter.post('/login',validarPedidoDeLogin,(req,res)=>{
	let usuarioNoAutenticado = req.body

	
		let index = _.findIndex(usuarios,usuario => usuario.username === usuarioNoAutenticado.username)

	if(index === -1){
		log.info("usuario no existe" + username)
		res.status(400).send("credenciales incorrectas o el usuario no existe")
		return
	}

	let hashedPassword = usuarios[index].password
	bcrypt.compare(usuarioNoAutenticado.password,hashedPassword,(err,iguales)=>{
		if(iguales){
		
			let token = jwt.sign({id : usuarios[index].id}, config.jwt.secretOrKey,{
				expiresIn : config.jwt.tiempoDeExpiracion
			})
			log.info("el usuario se logeo")
			res.status(200).json({token})
			
		}else{
			log.info("el usuario no se autentico")
			res.status(400).send("error")
		}


	})
})

module.exports = usuariosRouter