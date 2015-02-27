module.exports = function(io, gameDB) {
    // moved the big and ugle games list out of here
    var gamesList = require('./gamesList.js');

    // socket things
    io.on('connection', function (socket) {
        //socket.emit('gameStart', gamesList["sampleGame"]);
            
        socket.on('startGameFromTemplate', function(data){
            var query = { templateName: data.templateName };
            gameDB.findTemplate(data, function(result){
                console.log(result)
            }); 
        }); 

        // sample Game functions
        socket.on('my other event', function (data) {
            console.log(data);
        });

        socket.on('getSampleGame', function(data){
            // join the room that you were sent from
            socket.room = data.gameName;
            socket.join(data.gameName);
            //console.log(data, socket.room);
            var game = gamesList[data.gameName];
            //console.log(game);
            socket.emit('SampleUpdate', game);

        });

        socket.on('resetSampleGame', function(data){
            //console.log(data);
            var game = gamesList[data.gameName]
            for(var i = 0; i < playerList.length; i++){
                playerList[i].money = game.startMoney;
            }
            io.to(socket.room).emit('SampleUpdate', game);
        });

        socket.on('updateSampleGame', function(game){ 
            console.log(game);
            gamesList[game.gameName] = game;
            io.to(socket.room).emit('SampleUpdate', game);
        });

        socket.on('disconnect', function(){
            socket.leave(socket.room);
        })
       
        // test connections functions will not be useful soon
        // can you send multiple things over the socket?
        // generates random ammounts of money and sends them to the client endlessly
        
        testingConnection = function(){
            var testConnection = function(game){
                var players = gamesList["testConnection"]["playerList"];
                for (player in players){
                    if(players.hasOwnProperty(player)){
                        players[player]['money'] = Math.random()*players[player]['imoney'];
                    }    
                }             
                // io.socket.emit('testConnection', game)
                io.to(socket.room).emit('testConnection', game);
                console.log("Sending Socket");
            };
            testConnection(gamesList["testConnection"]);
            
            // use this to test your connection, if you see the game money updating
            // you are in good shape
            var repeatTest = setInterval(function(){
                testConnection(gamesList["testConnection"]);
                }, 1000);

            //turn off the test after a few seconds
            setTimeout( function(){
                clearInterval(repeatTest);
                console.log("Done Sending");
            }, 4000)
        }
        socket.on("startTest", testingConnection);
    });
}
