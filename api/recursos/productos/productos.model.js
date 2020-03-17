const mongoose = require('mongoose')


const productoSchema = new mongoose.Schema({
	titulo: {
		type: String,
		required : [true ,'producto debe tener un titulo']
	},
	precio : {
		type: Number,
		min : 0,
		required : [true , 'el producto debe tener un precio']
	},
	moneda : {
		type: String,
		maxlength : 3,
		minlength: 3,
		required : [true , 'el producto debe tener una moneda']
	},
	dueño : {
		type: String,
		required : [true , 'el producto debe estar asociado a un usuario']
	}
})

module.exports = mongoose.model('producto',productoSchema)