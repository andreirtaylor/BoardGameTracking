'use strict';
var app = require("../app.js"),
    server = app.server;
var port = 8000;
var io = require('socket.io-client');
var socketURL = "http://localhost:" + port;

// this allows the test to be run muliple times
var options ={
    //transports: ['websocket'],
    'force new connection': true
};

var mongoReady = function(){
    return app.db;
};


describe('Server connection', function () {
    it('should connect in a few seconds', function(done){
        //start the server
        server.listen(port);
        // wait for the server to connect
        var wait = setInterval(function(){
            if(mongoReady()){
                //console.log('ready!!!');
                clearInterval(wait);
                done();
            }
        }, 1);
    });

    // look in the local db for powergrid
    it('should find powergrid', function (done) {
        var socket = io.connect(socketURL, options);
        socket.emit('startGame', {templateName:'PowerGrid'});
        socket.on('startGame', function(result){
            result.should.have.property('templateName', 'PowerGrid');
            socket.disconnect();
            done();
        });
    });

});

describe('Kill everything', function () {
    // it should be able to close down the connection
    it('Should close', function(done){
        this.timeout(5000);
        server.close(function(){
            done();
        });
        app.db.close();
    });
});
