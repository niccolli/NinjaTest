var util = require('util');
var ws  = require('websocket-server');

var sockets = [];
var streamFromID = null;

var server = ws.createServer();

server.addListener("connection", function(connection){
	if(!streamFromID){
		streamFromID = connection.id;
		util.debug("Client connected: " + streamFromID);
	}
	
	connection.addListener("message", function(message){
		if(connection.id == streamFromID){
			server.broadcast(message);
		}
	});
});

server.listen(9540);

