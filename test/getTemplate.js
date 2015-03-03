'use strict';
var app = require("../app.js"),
    server = app.server;

var port = 8000;
var io = require('socket.io-client');
var socketURL = "http://localhost:" + port;


describe('Server connection', function () {

    server.listen(port);

    it('should connect in a few seconds', function(done){
        this.timeout(1001);
        setTimeout(function(){
            console.log(db);
            var db = app.db;
            db.should.not.equal(null)
        }, 1000);
    });

    it('should find powergrid', function (done) {
        var socket = io.connect(socketURL);
        socket.emit('getGameTemplate', {templateName:'PowerGrid'})
        socket.on('recieveGameTemplate', function(result){
            console.log(result);
            result.should.have.property('templateName', 'PowerGrid');
            socket.disconnect();
            done();
        });
    });
    server.close(function(){console.log('done')});
});

