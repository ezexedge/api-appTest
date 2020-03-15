const Joi = require('joi')
const log = require("./../../../utils/logger")


const blueprintProducto = Joi.object().keys({
	titulo : Joi.string().max(100).required(),
	precio: Joi.number().positive().precision(2).required(),
	moneda: Joi.string().length(3).uppercase()
})


module.exports = (req,res,next) =>{
	let resultado = Joi.validate(req.body,blueprintProducto,{abortEarly: false,convert:false})
	if(resultado.error === null){
		next()
	}else{
		let erroresDeValidacion = resultado.error.details.reduce((acumulador,error) => {

			return acumulador + `[${error.message}]`

		},"")
		log.warn("el siguiente producto no paso la validacion", req.body,erroresDeValidacion)
		res.status(400).send(`${erroresDeValidacion}`)
	}
}