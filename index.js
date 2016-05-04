var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

	var nicknames = {};
	nicknames.name = [];
	server.listen(3000);

	app.get('/',function(req,res){
		res.sendFile(__dirname + '/index.html');
	});

	io.sockets.on('connection',function(socket){
		
		socket.on('set nickname',function(data,callback){
			
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