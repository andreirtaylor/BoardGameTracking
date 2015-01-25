(function(){
    socket = io.connect('http://localhost:3000');
        socket.on('gameStart', function (data) {
            console.log(data);
            game = data;
            socket.emit('my other event', { my: 'data' });
        }); 
        
})()
