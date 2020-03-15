const express = require("express")
const _ = require("underscore")
const productos = require("./../../../database").productos
const uuid = require('uuid/v4')
const Joi = require('joi')
const passport = require('passport')
const validarProducto = require('./productos.validate')
const log = require("./../../../utils/logger")
const jwtAuthenticate = passport.authenticate('jwt',{session: false})
const productosRouter = express.Router()



//precision que solo admite 2 decimales


productosRouter.get('/' ,jwtAuthenticate,(req,res)=>{
		res.json(productos)
	})
productosRouter.post('/',[jwtAuthenticate, validarProducto],(req,res)=>{
		
		let nuevoProducto = {
			...req.body,
			id: uuid(),
			dueño: req.user.username
		}
		productos.push(nuevoProducto)
		log.info("producto agregado",nuevoProducto)
		res.status(201).json(nuevoProducto)
	})


productosRouter.get('/:id',jwtAuthenticate,(req,res) => {
	for(let producto of productos){
		if(producto.id === req.params.id){
			res.json(producto)
			return
		}


	}
	res.status(404).send(`el id ${req.params.id} no existe`)

	})
	productosRouter.put('/:id',[jwtAuthenticate, validarProducto],(req,res)=>{
		let id = req.params.id

		let reemplazoParaProducto = {
			...req.body,
			id : req.params.id,
			dueño : req.user.username
		}

		let indice = _.findIndex(productos , producto  => producto.id === reemplazoParaProducto.id)

		if(indice !== -1){
			log.info("usuario no es dueño del producto")
			if(productos[indice].dueño !== reemplazoParaProducto.dueño){
				res.status(400).send("no eres el dueño del producto")
				return
			}
			reemplazoParaProducto.id = id
			productos[indice] = reemplazoParaProducto
			log.info(`el producto con id ${id} remplazado con nuevo producto`, reemplazoParaProducto)
			res.status(200).json(reemplazoParaProducto)
		}else{
				res.status(404).send(`el id ${id} no existe`)
		}

	})
	productosRouter.delete('/:id',jwtAuthenticate,(req,res)=>{
		let indiceABorrar =  _.findIndex(productos , producto  => producto.id === req.params.id)
		if(indiceABorrar === -1){
			log.warn(`el producto con id ${id} remplazado con nuevo producto`, reemplazoParaProducto)

			res.status(404).send("no existe el producto")
			return
		}
				if(productos[indiceABorrar].dueño !== req.user.username){
				log.info("no eres dueño del producto")
				res.status(400).send("no eres el dueño del producto")
				return
			}



		let borrado = productos.splice(indiceABorrar,1)
		res.json(borrado)

	})


module.exports = productosRouter