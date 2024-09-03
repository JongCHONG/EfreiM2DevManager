const express = require('express');
const http = require("http");
const {Server} = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server);


const users = {};

// page d'accueil
app.get("/", (req, res) => {
	// une page html :)
	res.sendFile( __dirname + "/index.htm" );
});


io.on('connection' , (socket) => {
	console.log('Un utilisateur est connecté');

	socket.on("send", (data) => { // message envoyer à partir d'un client
		const {from, msg} = data;

		console.log("Message recu de "+from)
		console.log("Message :  "+msg)

		// chercher si le message est destiner à qqu
		// @mounir bonjour je suis la

		if(msg.startsWith('@') ){
			let name = msg.substring(1, msg.indexOf(" "))
			io.to(users[name]).emit("recupererMsg", msg.substring(name.length+2));
		}else{
			// message et envoyer a tout le monde
			console.log("Message envoyer à tout le monde")
			io.emit("recupererMsg", msg);
		}

		console.log("\n")
		//io.to(users[nom]).emit("recupererMsg", msg); // pour l'ensemble des utilisateurs connecter
	});

	socket.on("register", (username) => { // message envoyer à partir d'un client
		users[username] = socket.id
		console.log('Un utilisateur est connecter sous le nom de '+ username);
	});

	socket.on("disconnect" , () =>{
		for(let username in users){
			if(users[username] == socket.id){
				delete users[username];
				break;
			}
		}
		console.log('Un utilisateur est déconnecté');
	});

});


// demmarer le server
server.listen(3001, () => {
	console.log("Serveur et bien lancer sur le port 3001")
})





 
 
