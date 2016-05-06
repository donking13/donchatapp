var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	port = process.env.PORT || 3000;

	var users = {},
		connected = [];
	server.listen(port,function(){
		console.log('server listening at port %s',port);
	});

	app.get('/',function(req,res){
		res.sendFile(__dirname + '/index.html');
	});

	io.on('connection', function(socket){
		connected.push(socket);
		console.log('%s connected users',connected.length);

	  socket.on('switch room',function(room){
	  	//socket.leave(room);
	  	socket.join(room);
	  	console.log(room);
	  	io.to(room).emit('some event',`hey! room ${room}` );

	  });
	  
	  

	  socket.on('new user',function(data,callback){
	  	if(data.users in users){
	  		callback(true);
	  	}else{
	  		callback(false);
	  		socket.nickname = data.users;
	  		users[socket.nickname] = socket;
	  		console.log(socket.nickname);
	  		updateUserList(data.room);
	  		console.log(Object.keys(users));
	  	}
	  });

	   function updateUserList(currentRoom){
	  	io.emit('usernames',Object.keys(users),currentRoom);
	  }

	  socket.on('send message',function(data, roomcurrent){
	  	//io.emit('new message',data);
	  	io.to(roomcurrent).emit('some event',`hey! room ${roomcurrent}`);
	  	//socket.broadcast.to(roomcurrent).emit('new message',data);
	  	io.in(roomcurrent).emit('new message',{msg:data,user:socket.nickname});
	  	console.log(data);
	  });


	  socket.on('leave room',function(room){
	  	socket.leave(room.room);
	  	delete users[socket.nickname];
		updateUserList();
	  	//socket.join(room);
	  	console.log(room);
	  	io.to(room).emit('some event',`leave! room ${room}` );
	  });

	  // Disconnect
		socket.on('disconnect',function(data){

			connected.splice(connected.indexOf(socket));
			console.log('%s disconnected user', connected.length);
			if(!socket.nickname) return;
			delete users[socket.nickname];
			updateUserList();
		});
	});






