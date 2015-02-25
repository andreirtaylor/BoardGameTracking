var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insert([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
}

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    console.log("Found the following records");
    console.dir(docs)
    callback(docs);
  });
}

var removeDocuments = function(db, callback) {

    var collection = db.collection('documents');

    collection.remove({}, function(err, result){
        console.log("should have removed all documents");
        callback(result);
    }
    );


}



module.exports = function(MongoClient, url, assert) {
    // Use connect method to connect to the Server
    // if we do not connect it will print a error message
    MongoClient.connect(url, function(err, db) {
        // for now it will be a soft error
        // but we can always go back if we need to
        //assert.equal(null, err);
        if(err != null){
            // something went wrong abort abort!!!
            console.log('Error from DB: ' + err);
            console.log('Did not connect to database');
            return;
        }
        // if you get here you connected
        console.log( "Connected correctly to Database" );

        ///insert documents then fetch them and print them to the console.
        insertDocuments(db, function(){
            console.log('im back from a insert')
            findDocuments(db, function(){
                //db.close();
            });
            removeDocuments(db, function(){});
            findDocuments(db, function(){
                db.close();
            });
        });

    });
}
