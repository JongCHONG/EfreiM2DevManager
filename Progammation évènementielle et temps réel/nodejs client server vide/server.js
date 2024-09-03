const express = require('express');
const http = require("http");
const {Server} = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server);


// page d'accueil
app.get("/", (req, res) => {
	// une page html :)
	res.sendFile( __dirname + "/index.htm" );
});


io.on('connection' , (socket) => {
	console.log('Un utilisateur est connecté');

	socket.on("send", (msg) => { // message envoyer à partir d'un client
		console.log("Serveur : "+msg);
	});

	socket.on("disconnect" , () =>{
		console.log('Un utilisateur est déconnecté');
	});

});


// demmarer le server
server.listen(3001, () => {
	console.log("Serveur et bien lancer sur le port 3001")
})





 
 
