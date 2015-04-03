module.exports = function(app) {
    var io = app.io;
    var db = app.db;
    var crypto = app.crypto;
    var chance = app.chance;
    var ObjectId = app.ObjectId();
    // the option for querying games from the database
    var findGames = { '_id': 0, 'hash':0 },
        findUsers = { '_id': 0, 'hash':0 },
        findTemplates = {'_id': 0 }


    var url = require('url');

    function _error(err) {
        if(err){
            console.log('error from mongo' + err);
        }
    }

    // GT = game template collection
    templateDB = db.collection('gameTemplates');
    // GR = game repository
    gamesDB = db.collection('games');
    // UR user repository
    userDB = db.collection('userInfo');

    var parseGameTemplate = function(object){
        if (!object.templateName) return;
        return {
            search: object.templateName.toUpperCase()
        };
    };

    // inserts a new game in the database
    db.insertNewGame = function (game, callback) {
        game.room = chance.integer({min:1000, max:10000}) + '-' + chance.province() + '-' + chance.state();
        var room = game.room;
        gamesDB.findOne({ 'room': room }, findGames, function (err, doc) {
            _error(err);
            if (!doc) {
                gamesDB.insert(game, function (err, result) {
                    _error(err);
                    // im not sure why we need to do this but it seems like
                    // the _id is being added into the game even though it shouldnt be.
                    callback(game);
                });
            } else {
                db.insertNewGame(game, callback);
            }
        });
    };

    io.on('connection', function (socket) {
        socket.on('startGame', function(game){
            var query = parseGameTemplate(game);
            // get the query from the game Templates collection
            templateDB.findOne( query, findGames, function(err, doc) {
                _error(err);
                if(!doc){
                    socket.emit('invalidGameTemplate');
                    return;
                }
                game.templateName = doc.templateName;
                for(var i = 0; i < game.gamePlayers.length; i++){
                    game.gamePlayers[i].cash = doc.startMoney;
                };
                db.insertNewGame(game, function(game){
                    var username = socket.request.session.passport.user &&
                        socket.request.session.passport.user.username;
                    if(username){
                        var query = { "username": username };
                        var gameId = doc._id;
                        var update = {$push: {inProgress: game._id} }
                        userDB.update( query, update );
                    }
                    delete game._id;
                    socket.emit('startGame', game);
                });
            });
        });

        socket.on('connectme', function (data) {
            var room = url.parse(data.url, true).query.room;
            gamesDB.findOne({ 'room': room }, findGames, function (err, game) {
                _error(err);
                if (game){
                    socket.room = game.room;
                    socket.join(game.room);
                    socket.emit('incomingGame', game);
                }
            });
        });

        socket.on('testTemplate', function(search){
            var query = parseGameTemplate(search)
            templateDB.findOne(query, findTemplates,  function(err, template){
                _error(err);
                socket.emit('validTemplate', template)
            })
        });

        socket.on( 'updateGame' , function (game) {
            var room = game.room;
            var query = { 'room':room };
            var update = {
                $set:{
                    'gamePlayers':game.gamePlayers
                }
            };
            gamesDB.update( query, update );
            io.to(socket.room).emit('incomingGame', game);
        });

        // initilizes the profile of a signed in player
        socket.on( 'initProfile' , function () {
            // find the player in the database
            username = socket.request.session.passport.user &&
                socket.request.session.passport.user.username;
            if (!username) return;
            userDB.findOne(
                {'username': username },
                findUsers,
                function(err, userFromDB){
                    _error(err);
                    //games in progress
                    gamesIP = userFromDB.inProgress;
                    objectIds = gamesIP ? gamesIP : [];

                    // go find the games
                    gamesDB.find(
                        {'_id': { $in: objectIds }},
                        findGames
                        ).toArray(function(err, games){
                            userFromDB.inProgress = games;
                            socket.emit('initProfile', userFromDB);
                        }
                    );
                }
            );
        });
    });
};
