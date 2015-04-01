var express = require('express');
var app = express();
var io = require('socket.io').listen(app.listen(3000));



//requests coming for desktop
app.get('/', function(req, res){
   //console.log(req.query.id);
   res.sendfile(__dirname + '/public/index.html');
});


//requests coming for mobile
app.get('/mobile/:id', function(req, res){
   //console.log(req.params.id);
   res.sendfile(__dirname + '/public/mobile.html');
});

// handle rest of the requests
app.use(express.static(__dirname + '/public'));


//socket magic
io.sockets.on('connection', function (socket) {

	socket.on('new_room', function(data){
		socket.join(data);		
	});

	socket.on('play/pause', function(data){
		room = data.roomId;
		socket.broadcast.to(room).emit('play/pause', data);
	});
});