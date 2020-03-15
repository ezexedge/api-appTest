const _ = require("underscore")
const log = require("./../../utils/logger")
const usuarios = require("./../../database").usuarios
const bcrypt = require('bcrypt')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passportJWT = require('passport-jwt')
const keys = require('./../../config/keys')

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = new  JwtStrategy(opts,(jwtPayload,next)=>{
		let index = _.findIndex(usuarios,usuario => usuario.id === jwtPayload.id)

		if(index === -1){
		log.info("usuario no pudo ser autenticado")
		next(null,false)
		return
	}else{
		log.info("token valido")
		next(null,{
			username: usuarios[index].username,
			id: usuarios[index].id
		})
	}

})

