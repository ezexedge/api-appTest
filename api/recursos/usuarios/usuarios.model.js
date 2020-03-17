const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
	username : {
		type : String,
		minlength: 1,
		require :  [true , 'usuario debe tener username']
	},
	password : {
		type : String,
		minlength : 1 ,
		require :  [true , 'usuario debe tener password']
	},
	email : {
		type:  String,
		minlength: 1,
		require :  [true , 'usuario debe tener email']
	}
})

module.exports = mongoose.model('usuario', usuarioSchema)