var util = require('util');
var ws  = require('websocket-server');
var express = require('express');

var app = module.exports = express.createServer();

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
	app.use(express.errorHandler()); 
});

/*app.get('/', function(req, res){
	res.render('index', {
		title: 'Express'
	});
});*/
app.listen(3000);


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

