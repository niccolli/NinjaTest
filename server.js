var util = require('util');
var express = require('express');
var socketio = require('socket.io');

var app = module.exports = express.createServer(),
	io = socketio.listen(app);

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

app.listen(3000);

var clientNum = 0;
var deviceNum = 0;

var browse = io
			.of('/browse')
			.on('connection',function(socket){
				clientNum++;
				console.log(clientNum+': browser connected');
				socket.on('disconnect', function(){
					clientNum--;
					console.log(clientNum+': browser connected');
				});
			});


var device = io
			.of('/device')
			.on('connection', function(socket){
				console.log('device connected');
				deviceNum++;
				browse.emit('notify', {device: deviceNum});
				socket.on('send', function(msg){
					browse.volatile.emit('push', msg);
				});
			});

