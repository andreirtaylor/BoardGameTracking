'use strict';
var app = require("../app.js");

describe('It should allow me to insert', function () {
    it('', function (done) {
        var onePlusOne = 1 + 1;
        onePlusOne.should.equal(2);
        // must call done() so that mocha know that we are... done.
        // Useful for async tests.
        done();
    });
});
