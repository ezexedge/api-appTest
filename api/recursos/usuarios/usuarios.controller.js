const Usuario = require('./usuarios.model')

function obtenerUsuarios(){
	return Usuario.find({})
}

function crearUsuario(usuario,hashedPassword){
	return new Usuario({
		...usuario,
		password : hashedPassword
	}).save()
}


function usuarioExiste(username , email){
	//creamos una 8promesa por que en el then de usuarios.route espera una promsa
	return Promise((resolve,reject) => {
			Usuario.find().or([{'username' : username} , {'email': email }])
			//con or trato de encontrar un usuario que cumpla con el username y email
				.then(usuarios =>{
					resolve(usuarios.length > 0)
				})
				.catch(err =>{
					reject(err)
				})
	})


}

module.exports = {
	obtenerUsuarios
}