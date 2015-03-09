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

var socket;

describe('Starting a Game', function () {
    var sampleGame;

    beforeEach( function(done){
        socket = io.connect(socketURL, options);
        sampleGame = genXGames(1);
        sampleGame.templateName = files.getRandomTemplate();
        // you need to have a room otherwise you will not be sent a game do give an arbitrary room.
        socket.emit('startGame', sampleGame);
        socket.on('startGame', function(result){
            socket.emit('connectme', { url: 'http://localhost:3000/users/register/?room=' + result.room });
            done();
        });
    })

    // look in the local db for powergrid
    it('should find powergrid', function (done) {
        socket.on('incomingGame', function (result) {
            result.should.have.property('templateName');
            socket.disconnect();
            done();
        });
    });

    it('should give players money', function (done) {
        socket.on('incomingGame', function(result){
            var PL = result.gamePlayers;
            for(var i = 0; i < PL.length; i++){
                PL[i].should.have.property('cash');
            }
            socket.disconnect();
            done();
        });
    });

    //tests if the money that the players recieve corresponds to
    //the ammount defined in the template.
    it('gives players the right amount of money', function(done) {
        socket.on('incomingGame', function(result){
            var PL = result.gamePlayers;
            var startMoney = files.findStartMoney(result.templateName);
            for(var i = 0; i < PL.length; i++){
                PL[i].should.have.property('cash', startMoney);
            }
            socket.disconnect();
            done();
        });
    });

    it('should have given the game a room', function(done) {
        socket.on('incomingGame', function(result){
            result.should.have.property('room');
            socket.disconnect();
            done();
        });
    });
});
