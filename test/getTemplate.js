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


//start the server
server.listen(port);

describe('Server connection', function () {
    it('should connect in a few seconds', function(done){
        // wait for the server to connect
        setTimeout(function(){
            done();
        }, 500);
    });

    // look in the local db for powergrid
    it('should find powergrid', function (done) {
        var socket = io.connect(socketURL, options);
        console.log(socketURL)
        socket.emit('getGameTemplate', {templateName:'PowerGrid'});
        socket.on('recieveGameTemplate', function(result){
            console.log(result);
            result.should.have.property('templateName', 'PowerGrid');
            socket.disconnect();
            done();
        });
    });

    // it should be able to close down the connection
    it('Should close', function(done){
        server.close(function(){
            app.db.close();
            done();
        });
    });
});

