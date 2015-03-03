'use strict';
var app = require("../app.js"),
    server = app.server,
    db = app.db;

var port = 8000;
var io = require('socket.io-client');
var socketURL = "http://localhost:" + port;
var socket;

describe('Server connection', function () {
    this.timeout(30000);
    before(function () {
        socket = io.connect(socketURL);
        server.listen(port);
    });

    after(function () {
        server.close();
    });

    it('should find powergrid', function (done) {
        socket.emit('getGameTemplate', {templateName:'PowerGrid'})
        socket.on('recieveGameTemplate', function(result){
            console.log(result);
            result.should.have.property('templateName', 'PowerGrid');
            done();
        });
    });
});
