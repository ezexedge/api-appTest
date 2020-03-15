const Joi = require("joi")
const log = require("./../../../utils/logger")

const bluePrintUsuario = Joi.object().keys({
	username : Joi.string().alphanum().min(3).max(30).required(),
	password : Joi.string().min(6).max(200).required(),
	email : Joi.string().email().required()
})

let validarUsuario = (req,res,next) =>{

	const resultado = Joi.validate(req.body,bluePrintUsuario,{abortEarly:false,convert: false})

	if(resultado.error === null){
		next()
	}else{

		log.warn("producto no pudo ser validado" , resultado.error.details.map(error => error.message))
		res.status(400).send("el usuario no cumple con los requisitos")
	}

}

const blueprintPedidoLogin = Joi.object().keys({
	username: Joi.string().required(),
	password : Joi.string().required()
})


const validarPedidoDeLogin = (req,res,next) => {
	const resultado  = Joi.validate(req.body , blueprintPedidoLogin , {convert:false, abortEarly: false})

	if(resultado.error === null){
		next()
	}else{
		res.status(400).send("login fallo")
	}
}

module.exports = {
	validarPedidoDeLogin,
	validarUsuario
}