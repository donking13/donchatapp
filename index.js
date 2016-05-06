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


	io.sockets.on('connection',function(socket){
		connection.push(socket);
		console.log('connections: %s', connection.length);

		//Globals
	  	var defaultRoom = 'general';
	  	var rooms = ["General", "angular", "socket.io", "express", "node", "mongo", "PHP", "laravel"];

		socket.on('set nickname',function(data,room,callback){
			if(data in users){
				callback(false);
			}else{
				callback(true);
			    //New user joins the default room
			    socket.join(defaultRoom);
			    //console.log(data.room);
				socket.nickname = data;
				users[socket.nickname] = socket;
				updateUserList();
			}
		});

		function updateUserList(){
			io.sockets.emit('usernames',Object.keys(users));
		}

		socket.on('send message', function(data){
			io.sockets.emit('new message',{'msg':data,'name':socket.nickname});
		});

		socket.on('switch room',function(data){
			socket.leave(defaultRoom);
			socket.join(a);
		});

		// Disconnect
		socket.on('disconnect',function(){
			console.log('connections: %s', connection.length);
			if(!socket.nickname) return;
			delete users[socket.nickname];
			updateUserList();
		});
	});



