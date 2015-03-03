// ================Database=================
// This allows the database to inheret all the functions
// we want when it is finished connecting
// by writing the module this way we extend the databases
// functionalit instead of overwriting

module.exports = function(db){
    // this is baggage from before, this will not be used
    db.insertDocuments = function(callback) {
        // Get the documents collection
        var collection = this.collection('gameTemplates');
        // Insert some documents
        collection.insert([
            {a : 1}, {a : 2}, {a : 3}
        ], function(err, result) {
            console.log("Inserted 3 documents into the document collection");
            callback(result);
        });
    }

    // Finds the game template for the given criteria
    // criteria is in the form 
    //     { gameTemplate: "name to search"  }
    db.findTemplate = function(criteria, callback){
        // Get the documents collection
        var collection = this.collection('gameTemplates');
        // find the game template in the game Template
        // collection
        collection.findOne(criteria,{'_id':0} , function(err, docs) {
            console.log(criteria)
            callback(docs);
        });
    }
}
