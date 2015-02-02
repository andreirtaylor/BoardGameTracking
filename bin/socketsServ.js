module.exports = function(io) {
    var gamesList = {
        sampleGame:{
            playerList:
            [
                {
                    name: "Andrei",
                    money: 123.34
                },
                {
                    name: "Jonah",
                    money: -100000000.0
                },
                {
                    name: "Paul",
                    money: 0937.80
                },
                {
                    name: "Jason",
                    money: 80085.69
                 },
                 {
                    name: "Chris",
                    money: 0.00
                 }
            ],
            gameName: "sampleGame",
            numberOfPlayers: 5
        },
        testConnection:{
            playerList:
            [
                {
                    name: "Andrei",
                    imoney: 100.00,
                    money: 100
                },
                {
                    name: "Jonah",
                    imoney: -100000000.0,
                    money: -100000000.0
                },
                {
                    name: "Paul",
                    imoney: 937.80,
                    money: 937.80
                },
                {
                    name: "Jason",
                    imoney: 80085.69,
                    money: 80085.69
                 },
                 {
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
        socket.emit('gameStart', gamesList["sampleGame"]);
        
        socket.on('my other event', function (data) {
            console.log(data);
        });

        // can you send multiple things over the socket?
        // generates random ammounts of money and sends them to the client endlessly
        //
        socket.on("startTest", function(){
            var testConnection = function(game){
                var players = gamesList["testConnection"]["playerList"];
                console.log(players);
                for (player in players){
                    if(players.hasOwnProperty(player)){
                        players[player]['money'] = Math.random()*players[player]['imoney'];
                        console.log(players[player]['money']);
                    }    
                }             
                socket.emit('testConnection', game)
                console.log("Sending Socket");
            };
            
            // use this to test your connection, if you see the game money updating
            // you are in good shape
            var repeatTest = setInterval(function(){
                testConnection(gamesList["testConnection"]);
                }, 2000);

            //turn off the test after a few seconds
            setTimeout( function(){
                clearInterval(repeatTest);
                console.log("Done Sending");
            }, 8000)
        
        });

        socket.on('updateGameData', function(newGameData){ 
            //todo
        })
    });
}
