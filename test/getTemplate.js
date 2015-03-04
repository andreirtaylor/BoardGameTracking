'use strict';
var app = require("../app.js"),
    server = app.server;
var port = 8000;
var io = require('socket.io-client');
var socketURL = "http://localhost:" + port;
var genXGames = require('./generateGames');

// this allows the test to be run muliple times
var options ={
    //transports: ['websocket'],
    'force new connection': true
};

// list of game templates
var templates = [
    { 
        startMoney: 50, 
        templateName: "PowerGrid"
    },
    {
        startMoney: 1500,
        templateName: "Monopoly"
    }
];

// given a template name find the expected start money
var findStartMoney = function(templateName){
    for(var i = 0; i < templates.length; i++){
        if(templates[i].templateName == templateName){
            return templates[i].startMoney;
        }
    }
};

// get a random template from the ones available.
var getRandomTemplate = function(){
    var index = Math.floor( Math.random() * templates.length );
    return templates[index].templateName;
}

var mongoReady = function() {
    return app.db;
};

var dbName = 'gameTemplates';

// insert document into the game db
var insert = function(documents, donefunc){
    // Get the documents collection
    var collection = app.db.collection(dbName);
    // Insert some documents
    collection.insert(documents, function(err, result) {
        if(!err){
            donefunc();
        }
    });
};

// setup the server
describe('Server connection', function () {
    it('should connect in a few seconds', function(done){
        //start the server
        server.listen(port);
        // wait for the server to connect
        var wait = setInterval(function(){
            if(mongoReady()){
                //console.log('ready!!!');
                clearInterval(wait);
                insert(templates, done);
            }
        }, 1);
    });
});

describe('Starting a Game', function () {
    var sampleGame;

    beforeEach(function(){
        sampleGame = genXGames(1);
        sampleGame.templateName = getRandomTemplate();
    })

    // look in the local db for powergrid
    it('should find powergrid', function (done) {
        var socket = io.connect(socketURL, options);
        socket.emit('startGame', sampleGame);

        socket.on('startGame', function(result){
            result.should.have.property('templateName');
            socket.disconnect();
            done();
        });
    });

    it('should give players money', function (done) {
        var socket = io.connect(socketURL, options);
        socket.emit('startGame', sampleGame);

        socket.on('startGame', function(result){
            socket.disconnect();
            var PL = result.gamePlayers;
            for(var i = 0; i < PL.length; i++){
                PL[i].should.have.property('cash');
            }
            done();
        });
    });

    //tests if the money that the players recieve corresponds to
    //the ammount defined in the template.
    it('gives players the right amount of money', function(done) {
        var socket = io.connect(socketURL, options);

        socket.emit('startGame', sampleGame);
        socket.on('startGame', function(result){
            socket.disconnect();
            var PL = result.gamePlayers;
            var startMoney = findStartMoney(result.templateName);
            for(var i = 0; i < PL.length; i++){
                PL[i].should.have.property('cash', startMoney);
            }
            done();
        });
    });
});

// after each testrun we should close down everything
describe('Kill everything', function () {
    // it should be able to close down the connection
    it('closes without complaint', function (done) {
        // now close the server
        server.close(function(){
            // when the server is closed clear the db
            app.db.collection(dbName).remove({}, function(){
                // when the db is clear close it
                app.db.close(function(){
                    done();
                });
            });
        });
    });
});
