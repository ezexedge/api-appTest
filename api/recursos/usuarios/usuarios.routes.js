const express = require("express")
const _ = require("underscore")
const uuid = require('uuid/v4')
const Joi = require('joi')
const validarUsuario = require('./usuarios.validate').validarUsuario
const validarPedidoDeLogin = require('./usuarios.validate').validarPedidoDeLogin
const log = require("../../../utils/logger")
const usuarios = require('../../../database').usuarios
const bcrypt  = require("bcrypt")
const jwt = require("jsonwebtoken")
const usuariosRouter = express.Router()

usuariosRouter.get('/',(req,res)=>{
	res.json(usuarios)
})

usuariosRouter.post('/',validarUsuario,(req,res)=>{
	let nuevoUsuario = req.body

	let indice = _.findIndex(usuarios,usuario=>{
		return usuario.username === nuevoUsuario.username || usuario.email === nuevoUsuario.email

	})

	if(indice !== -1){
		//conflig
		log.info("el email o el nombre se encuentran en la base de datoss")
		res.status(409).send("el email o el usuario ya esta asociada a una cuenta")
		return 
	}

	bcrypt.hash(nuevoUsuario.password,10,(error,hashedPassword)=>{
		if(error){
			log.error("error ocurrio al tratar de tener el hash",error)
			res.status(500).send("ocurrio el error")	
			return	
		}

		usuarios.push({
			username : nuevoUsuario.username,
			email : nuevoUsuario.email,
			password : hashedPassword,
			id: uuid()
		})
		
		res.status(201).send("usuario creado exitosamente")
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
		
			let token = jwt.sign({id : usuarios[index].id}, "secreto",{
				expiresIn : 86400
			})
			log.info("el usuario se logeo")
			res.status(200).json({token})
			
		}else{
			log.info("el usuario no se autentico")
			res.status(400).send("")
		}


	})
})

module.exports = usuariosRouter