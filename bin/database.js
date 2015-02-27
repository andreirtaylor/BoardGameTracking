// this is now the place for all of the function calls for the database
// the gameDB object in app.js has access to all of this
module.exports = function(db){
    db.insertDocuments = function(callback) {
        // Get the documents collection
        var collection = this.collection('gameTemplate');
        // Insert some documents
        collection.insert([
            {a : 1}, {a : 2}, {a : 3}
        ], function(err, result) {
            console.log("Inserted 3 documents into the document collection");
            callback(result);
        });
    }

    // Finds the game template for the given criteria
    // criteria is in the form { gameTemplate: "name to search"  }
    db.findTemplate = function(criteria, callback) {
        // Get the documents collection
        var collection = this.collection('gameTemplate');
        // Find some documents
        collection.findOne(criteria , function(err, docs) {
            callback(docs);
        });
    }
    console.log(db.collection('gameTemplate'))
    db.insertDocuments(function(){})
    db.findTemplate({}, function(result){console.log(result)})
}
