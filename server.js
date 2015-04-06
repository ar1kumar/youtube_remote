var express = require('express');
var app = express();

//change for heroku
//var port_number = server.listen(process.env.PORT || 3000);


//var io = require('socket.io').listen(app.listen(3000));

var io = require('socket.io').listen(app.listen(process.env.PORT || 3000));



//requests coming for desktop
app.get('/', function(req, res){
   //console.log(req.query.id);
   res.sendfile(__dirname + '/public/index.html');
});


//requests coming for mobile
app.get('/m/:id', function(req, res){
   //console.log(req.params.id);
   res.sendfile(__dirname + '/public/mobile.html');
});


//search request coming from ajax call
app.get('/search', function(req, res){
   //console.log(req.params.id);
   res.sendfile(__dirname + '/public/lib/search_vid.php');
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
	
	socket.on('volume', function(data){
		room = data.roomId;
		socket.broadcast.to(room).emit('volume', data);
	});
	
	socket.on('action', function(data){
		room = data.roomId;
		socket.broadcast.to(room).emit('reaction', data);
	});
	
});