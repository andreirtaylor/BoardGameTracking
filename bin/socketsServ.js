module.exports = function(io) {
    var gamesList = {
        samplegame:{
            playerList:
            [
                {
                    id:0,
                    name: "Andrei",
                    money: 50
                },
                {
                    id:1,
                    name: "Jonah",
                    money: 50
                },
                {
                    id:2,
                    name: "Paul",
                    money: 50
                },
                {
                    id:3,
                    name: "Jason",
                    money: 50 
                 },
                 {
                    id:4,
                    name: "Chris",
                    money: 50
                 }
            ],
            startMoney:50,
            gameName: "samplegame",
            numberOfPlayers: 5
        },
        testConnection:{
            playerList:
            [
                {
                    id:0,
                    name: "Andrei",
                    imoney: 100.00,
                    money: 100
                },
                {
                    id:1,
                    name: "Jonah",
                    imoney: -100000000.0,
                    money: -100000000.0
                },
                {
                    id:2,
                    name: "Paul",
                    imoney: 937.80,
                    money: 937.80
                },
                {
                    id:3,
                    name: "Jason",
                    imoney: 80085.69,
                    money: 80085.69
                 },
                 {
                    id:4,
                    name: "Chris",
                    imoney: 1.00,
                    money: 1.00
                 }
            ],
            gameName: "sampleGame",
            numberOfPlayers: 5
        }
    };

    // socket things
    io.on('connection', function (socket) {
        //socket.emit('gameStart', gamesList["sampleGame"]);

        // sample Game functions
        socket.on('my other event', function (data) {
            console.log(data);
        });

        socket.on('getSampleGame', function(data){
            // join the room that you were sent from
            socket.room = data.gameName;
            socket.join(data.gameName);
            console.log(data, socket.room);
            var game = gamesList[data.gameName];
            console.log(game);
            socket.emit('SampleUpdate', game);

        });

        socket.on('resetSampleGame', function(data){
            console.log(data);
            var game = gamesList[data.gameName]
            for(var i = 0; i < playerList.length; i++){
                playerList[i].money = game.startMoney;
            }
            io.to(socket.room).emit('SampleUpdate', game);
        });

        socket.on('updateSampleGame', function(game){ 
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
