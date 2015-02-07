module.exports = function(io) {
    var gamesList = {
        sampleGame:{
            playerList:
            [
                {
                    id:1,
                    name: "Andrei",
                    money: 50
                },
                {
                    id:2,
                    name: "Jonah",
                    money: 50
                },
                {
                    id:3,
                    name: "Paul",
                    money: 50
                },
                {
                    id:4,
                    name: "Jason",
                    money: 50 
                 },
                 {
                    id:5,
                    name: "Chris",
                    money: 50
                 }
            ],
            startMoney:50,
            gameName: "sampleGame",
            numberOfPlayers: 5
        },
        testConnection:{
            playerList:
            [
                {
                    id:1,
                    name: "Andrei",
                    imoney: 100.00,
                    money: 100
                },
                {
                    id:2,
                    name: "Jonah",
                    imoney: -100000000.0,
                    money: -100000000.0
                },
                {
                    id:3,
                    name: "Paul",
                    imoney: 937.80,
                    money: 937.80
                },
                {
                    id:4,
                    name: "Jason",
                    imoney: 80085.69,
                    money: 80085.69
                 },
                 {
                    id:5,
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
        
        socket.on('my other event', function (data) {
            console.log(data);
        });

        socket.on('getSampleGame', function(data){
            console.log(data);
            game = gamesList[data.gameName];
            socket.emit('SampleUpdate', game);
        });

        socket.on('updateGameData', function(newGameData){ 
            gamesList.sampleGame = newGameData;
            console.log(newGameData);
            socket.emit('newGameData', sampleGame);
        })

        // can you send multiple things over the socket?
        // generates random ammounts of money and sends them to the client endlessly
        //
        socket.on("startTest", function(){
            var testConnection = function(game){
                var players = gamesList["testConnection"]["playerList"];
                for (player in players){
                    if(players.hasOwnProperty(player)){
                        players[player]['money'] = Math.random()*players[player]['imoney'];
                    }    
                }             
                socket.emit('testConnection', game)
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
            }, 8000)
        });
    });
}
