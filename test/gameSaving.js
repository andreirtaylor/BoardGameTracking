'use strict';
var port = 3000;
var io = require('socket.io-client');
var socketURL = "http://localhost:" + port;
var genXGames = require('./generateGames');
var files = require('./testFiles')();

// this allows the test to be run muliple times
var options ={
    //transports: ['websocket'],
    'force new connection': true
};

var socket, game, sampleGame;

describe('Multiple Connections', function () {
    var sampleGame;

    beforeEach(function(done){
        socket = io.connect(socketURL, options);
        sampleGame = genXGames(1);
        sampleGame.templateName = files.getRandomTemplate();
        socket.emit('startGame', sampleGame);
        socket.on('startGame', function(result){
            socket.emit('connectme', { url: 'http://localhost:3000/users/register/?room=' + result.room });
            game = result;
            done();
        });
    })

    // look in the local db for powergrid
    it('should be able to reconnect', function (done) {
        var socket2 = io.connect(socketURL, options);
        socket2.emit('connectme', { url: 'http://localhost:3000/?room=' + game.room });

        socket2.on('incomingGame', function (result) {
            // the two games should be identical
            JSON.stringify(result).should.equal(JSON.stringify(game));
            done();
        });
    });

    it('should be able to update the game', function (done) {
        var money = 75;
        var run = false;
        game.gamePlayers[0].cash = money;
        socket.emit('updateGame', game);

        socket.on('incomingGame', function (result) {
            game.gamePlayers[0].cash.should.equal(money);
            if (run) done();
            run = true;
        });
    });
});
