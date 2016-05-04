var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	port = process.env.PORT || 3000;

	var nicknames = {};
	nicknames.name = [];

	server.listen(port,function(){
		console.log('server listening at port',port);
	});

	app.get('/',function(req,res){
		res.sendFile(__dirname + '/index.html');
	});

	// var nsp = io.of('/my-namespace');
	// nsp.on('connection', function(socket){

	//   socket.on('set nickname',function(data,callback){
			
	// 		if(nicknames.name.indexOf(data) != -1){
	// 			callback(false);
	// 		}else{
	// 			callback(true);
	// 			socket.nickname = data;
	// 			nicknames.name.push(data);
	// 			updateUserList();
	// 		}
	// 	});

	// 	function updateUserList(){
	// 		nsp.emit('usernames',nicknames.name);
	// 	}

	// 	socket.on('send message', function(data){

	// 		nsp.emit('new message',{'msg':data,'name':socket.nickname});
	// 	});

	// 	socket.on('disconnect',function(){
	// 		if(!socket.nickname) return;
	// 		nicknames.name.splice(nicknames.name.indexOf(socket.nickname),1);
	// 		updateUserList();
	// 	});
	// });


	io.sockets.on('connection',function(socket){
		
		
		io.to('some room').emit('some event');

		socket.on('set nickname',function(data,room,callback){
			console.log(room);
			socket.join(room);
			if(nicknames.name.indexOf(data) != -1){
				callback(false);
			}else{
				callback(true);
				socket.nickname = data;
				nicknames.name.push(data);
				updateUserList();
			}
		});



		function updateUserList(){
			io.sockets.emit('usernames',nicknames.name);
		}

		socket.on('send message', function(data){

			io.sockets.emit('new message',{'msg':data,'name':socket.nickname});
		});

		socket.on('disconnect',function(){
			if(!socket.nickname) return;
			nicknames.name.splice(nicknames.name.indexOf(socket.nickname),1);
			updateUserList();
		});
	});