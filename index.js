var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	port = process.env.PORT || 3000;

	var users = {},
		connection = [];

	server.listen(port,function(){
		console.log('server listening at port %s',port);
	});

	app.get('/',function(req,res){
		res.sendFile(__dirname + '/index.html');
	});


	io.on('connection', function(socket){




	  socket.on('switch room',function(room){
	  	//socket.leave(room);
	  	socket.join(room);
	  	console.log(room);
	  	io.to(room).emit('some event',`hey! room ${room}` );
	  });
	  
	  socket.on('leave room',function(room){
	  	socket.leave(room);
	  	//socket.join(room);
	  	console.log(room);
	  	io.to(room).emit('some event',`leave! room ${room}` );
	  });


	  socket.on('send message',function(data, roomcurrent){
	  	//io.emit('new message',data);
	  	io.to(roomcurrent).emit('some event',`hey! room ${roomcurrent}` );
	  	//socket.broadcast.to(roomcurrent).emit('new message',data);
	  	io.in(roomcurrent).emit('new message',data);
	  	console.log(data);
	  });

	});






