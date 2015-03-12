module.exports = function(app) {
    var io = app.io;
    var gameDB = app.db;
    var crypto = app.crypto;
    var chance = app.chance;
    var ObjectId = app.ObjectId();
    // the option for querying games from the database
    var findGames = { '_id': 0, 'hash':0 }
    var findUsers = { '_id': 0, 'hash':0 }

    var url = require('url');

    function _error(err) {
        console.log('error from mongo' + err);
    }

    // GT = game templats collection
    gameDB.GT = gameDB.collection('gameTemplates');
    // GR = game repository
    gameDB.GR = gameDB.collection('games');
    // UR user repository
    gameDB.UR = gameDB.collection('userInfo');

    var parseGameTemplate = function(template){
        return {
            templateName: template.templateName
        };
    };

    // inserts a new game in the database
    gameDB.insertNewGame = function (game, callback) {
        game.room = chance.integer({min:1, max:10000}) + '-' + chance.province() + '-' + chance.state();
        var room = game.room;
        gameDB.GR.findOne({ 'room': room }, findGames, function (err, doc) {
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
        var userId = socket.request.session.passport.user;
        console.log("Your User ID is", userId);

        socket.on('startGame', function(game){
            var query = parseGameTemplate(game);
            // get the query from the game Templates collection
            gameDB.GT.findOne( query, findGames, function(err, doc) {
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
            gameDB.GR.findOne({ 'room': room }, findGames, function (err, game) {
                if (err) _error(err);
                if (game){
                    socket.room = game.room;
                    socket.join(game.room);
                    socket.emit('incomingGame', game);
                }
            });
        });

        socket.on( 'updateGame' , function (game) {
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
                                io.to(socket.room).emit('incomingGame', game);
                            });
                        }
                    });
                }
            });
        });

        // initilizes the profile of a signed in player
        socket.on( 'initProfile' , function () {
            // find the player in the database
            username = socket.request.session.passport.user.username;
            gameDB.UR.findOne(
                {'username': username }, 
                findUsers,
                function(err, userFromDB){
                    if(err){ 
                        console.log("err from db" + err ); 
                        return;
                    }
                    // convert the games into object ids so we can find them
                    gamesIP = userFromDB.inProgress;
                    gamesIP = gamesIP ? gamesIP : [];
                    var objectIds = gamesIP.map(function(idObj){
                        return new ObjectId(idObj._id);
                    });
                    // go find the games
                    gameDB.GR.find(
                        {'_id': { $in: objectIds }},
                        findGames
                        ).toArray(function(err, games){
                            userFromDB.inProgress = games;
                            //console.log(userFromDB);
                            socket.emit('initProfile', userFromDB);
                        }
                    );
                }
            );
        });
    });
};
