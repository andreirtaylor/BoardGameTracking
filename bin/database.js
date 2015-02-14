module.exports = function(MongoClient, url, assert) {
    // Use connect method to connect to the Server
    // if we do not connect it will print a error message
    MongoClient.connect(url, function(err, db) {
        // for now it will be a soft error
        // but we can always go back if we need to
        //assert.equal(null, err);
        var message = err == null ? "Connected correctly to Database": "Did not connect to database";
        console.log(message);
        if(err == null) db.close();
    });
}
