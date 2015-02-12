module.exports = function(MongoClient, url, assert) {
    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db.close();
    });
}
