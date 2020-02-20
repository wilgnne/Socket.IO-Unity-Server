console.log("Initialize Server");

var io = require('socket.io')({
	transports: ['websocket'],
	pingInterval: 700
});

var clients = []

io.attach(4567);

io.on('connection', (socket) => {
	console.log("New Client Connected, ID:", socket.id);
	
	const newPlayer = {
		id: socket.id,
		position: {
			x: 0.0,
			y: 0.0,
			z: 0.0
		},
		rotation: {
			x: 0.0,
			y: 0.0,
			z: 0.0
		}
	};
	clients = [...clients, newPlayer];

	socket.emit('register', {
		clients,
		myID: socket.id
	});

	socket.broadcast.emit('newClient', newPlayer);

	console.log(clients);

	socket.on('updatePosition', (data) => {
		const index = clients.findIndex(element => element.id == data.id);
		if (index > -1) {
			clients[index].position = data.position;
			clients[index].rotation = data.rotation;
			socket.broadcast.emit('updateRemotePosition', data);
		}
	});

	socket.on('disconnect', () => {
		//socket.broadcast.emit("ddd", socket.id);

		const index = clients.findIndex(element => element.id == socket.id);
		console.log("Client", socket.id, "index:", index, "disconected");

		clients.splice(index, 1);
		console.log(clients);
	});
});

console.log("Server is UP");
