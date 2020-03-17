const express = require("express")
const _ = require("underscore")
const uuid = require('uuid/v4')
const Joi = require('joi')
const passport = require('passport')
const jwtAuthenticate = passport.authenticate('jwt',{session: false})
const productosRouter = express.Router()


const productoController = require("./productos.controller")
const productos = require("./../../../database").productos
const validarProducto = require('./productos.validate')
const log = require("./../../../utils/logger")
//precision que solo admite 2 decimales


function validarId(req,res,next){
	let id = req.params.id
	if(id.match( /^[0-9a-fA-F]{24}$/) === null){

		log.error("id invalida al id del url")
		res.status(400).send("el id ingresado en la url no es valida")
	return
	}

	next()

}


productosRouter.get('/' ,jwtAuthenticate,(req,res)=>{
	
		productoController.obtenerProductos()
			.then(productos =>{
				res.json(productos)
			})
			.catch(err => {
				res.status(500).send("error al obtener todos los productos")
			})

	})

productosRouter.post('/',[jwtAuthenticate, validarProducto],(req,res)=>{
		
			productoController.crearProducto(req.body,req.user.username)
			.then(producto => {
				log.info("producto agregado",producto.toObject())
				res.status(201).json(producto)
			})
			.catch(err=>{

				log.error("el producto no pudo ser creado",err)
				res.status(500).send("error al crear el producto")

			})

	
	})


productosRouter.get('/:id',validarId,(req,res) => {
	

	let id = req.params.id
	productoController.obtenerProducto(id)
		.then(producto => {
			if(!producto){
				res.status(404).send("el producto no existe")
			}else{
				res.json(producto)
			}

		})
		.catch(err => {
			log.error("ocurrio un error")
			res.status(500).send("error al obtener el id del producto")
		})


	})
	productosRouter.put('/:id',[jwtAuthenticate, validarProducto], async (req,res)=>{


		let id = req.params.id
		let resquestUsuario = req.user.username
		let productoAReemplazar


		try{
			productoAReemplazar = await productoController.obtenerProducto(id)

		}catch(error){
			log.warn("no se pudo modificar el producto")
			res.status(500).send("error al querer modificar el producto")
			return
		}

		if(!productoAReemplazar){
			res.status(404).send(`el producto con id ${id} no existe`)
			return
		}

		if(productoAReemplazar.dueño !== resquestUsuario){
			log.warn(`usuario ${resquestUsuario} no es dueño del producto`)
			res.status(401).send("no eres dueño del producto")
			return
		}

		productoController.reemplazarProducto(id,req.body,resquestUsuario)
			.then(producto => {
				res.json(producto)
				log.info("producto con id remplazado",producto.toObject())
			})
			.catch(err =>{
				log.error("excepcion a la hora de reemplazar el producto error")
				res.status(500).send("error al reemplazar el producto")

			})

	})

	
	productosRouter.delete('/:id',[jwtAuthenticate,validarId], async (req,res)=>{

		let id = req.params.id
		let productoABorrar

		try{
			productoABorrar = await productoController.obtenerProducto(id)
		}catch(err){
			log.error(`la excepcion no se pudo borrar id : ${id}`)
			res.status(404).send(`ocurrio un error al borrar id ${req.params.id}`)
		}

		if(!productoABorrar){
			log.warn(`el producto con id ${id} remplazado con nuevo producto`, reemplazoParaProducto)

			res.status(404).send("no existe el producto")
			return
		}

		let usuarioAuthenticado = req.user.username


				if(productoABorrar.dueño !== usuarioAuthenticado){
				log.info("no eres dueño del producto")
				res.status(401).send("no eres el dueño del producto")
				return
			}

		try{
			let productoBorrado = await productoController.borrarProducto(id)
			log.info(`producto ${id} fue borrado`)
			res.json(productoBorrado)
		}
		catch(err){
			res.status(500).send(`ocurrio un error borrando el producto ${id}`)
		}



	})


module.exports = productosRouter