// this is now the place for all of the function calls for the database
// the gameDB object in app.js has access to all of this
module.exports = function(db){
    db.insertDocuments = function(callback) {
        // Get the documents collection
        var collection = this.collection('documents');
        // Insert some documents
        collection.insert([
            {a : 1}, {a : 2}, {a : 3}
        ], function(err, result) {
            console.log("Inserted 3 documents into the document collection");
            callback(result);
        });
    }

    db.find = function(criteria, callback) {
        // Get the documents collection
        var collection = this.collection('documents');
        // Find some documents
        collection.find(criteria).toArray(function(err, docs) {
            callback(docs);
        });
    }
}
