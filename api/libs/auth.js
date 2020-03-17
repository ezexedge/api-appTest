const _ = require("underscore")
const bcrypt = require('bcrypt')

const passportJWT = require('passport-jwt')


const log = require("./../../utils/logger")
const usuarios = require("./../../database").usuarios
const keys = require('./../../config/keys')
const config = require('../../config')




let jwtOptions = {
	secretOrKey : config.jwt.secretOrKey,
	jwtFromRequest : passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()

}

module.exports = new  passportJWT.Strategy(jwtOptions,(jwtPayload,next)=>{
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

