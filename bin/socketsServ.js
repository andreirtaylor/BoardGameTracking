module.exports = function(app) {
    var io = app.io;
    var gameDB = app.db;
    var crypto = app.crypto;
    var chance = app.chance;
    // moved the big and ugly games list out of here
    var gamesList = require('./gamesList.js');
    var url = require('url');

    function _error(err) {
        console.log('error from mongo' + err);
    }

    // GT = game templats collection
    gameDB.GT = gameDB.collection('gameTemplates');
    // GR = game repository
    gameDB.GR = gameDB.collection('games');

    var parseGameTemplate = function(template){
        return {
            templateName: template.templateName
        };
    };

    // Finds the game template for the given criteria
    gameDB.updateGame = function (game, callback) {
        var room = game.room;
        gameDB.GR.insert(game, function(err, result){
            if (err) {
                _error(err);
            }
            //if you inserted correctly remove the old one
            else {
                gameDB.GR.remove({ 'room': room }, true, function (err, doc) {
                    if (err) _error(err);
                    if (doc) {
                        gameDB.GR.insert(game, function (err, result) {
                            if (err) _error(err);
                            // im not sure why we need to do this but it seems like
                            // the _id is being added into the game even though it shouldnt be.
                            delete game._id;
                            callback(game);
                        });
                    }
                });
            }
        });
    };

    var findOptions = { '_id': 0, 'hash':0 }

    gameDB.insertNewGame = function (game, callback) {
        game.room = chance.integer({min:1, max:10000}) + '-' + chance.province() + '-' + chance.state();
        var room = game.room;
        gameDB.GR.findOne({ 'room': room }, findOptions, function (err, doc) {
            if (err) _error(err);
            if (!doc) {
                gameDB.GR.insert(game, function (err, result) {
                    if (err) _error(err);
                    // im not sure why we need to do this but it seems like
                    // the _id is being added into the game even though it shouldnt be.
                    delete game._id;
                    callback(game);
                });
            } else {
                gameDB.insertNewGame(game, callback);
            }
        });
    };



    io.on('connection', function (socket) {

        socket.on('startGame', function(game){
            var query = parseGameTemplate(game);
            // get the query from the game Templates collection
            gameDB.GT.findOne( query, findOptions, function(err, doc) {
                for(var i = 0; i < game.gamePlayers.length; i++){
                    game.gamePlayers[i].cash = doc.startMoney;
                };
                gameDB.insertNewGame(game, function(){
                    socket.emit('startGame', game);
                });
            });
        });

        socket.on('connectme', function (data) {
            var room = url.parse(data.url, true).query.room;
            gameDB.GR.findOne({ 'room': room }, findOptions, function (err, game) {
                if (err) _error(err);
                if (game){
                    socket.room = game.room;
                    socket.join(game.room);
                    socket.emit('incomingGame', game);
                }
            });
        });

        // send me a game that has players and the template
        // that you want and I will start it for you
        //socket.mongo('startGame', function(game){
        //    console.log('emitting');
        //    socket.emit('startGame', game);
        //});

        socket.mongo('updateGame', function(game){
            io.to(socket.room).emit('incomingGame', game);
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
            //console.log(game);
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
                //console.log("Sending Socket");
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
                //console.log("Done Sending");
            }, 4000)
        }
        socket.on("startTest", testingConnection);
    });
}
