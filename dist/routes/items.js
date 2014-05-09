var mongo = require('mongodb');
 
var Connection = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var db = new Db('grocerydb', new Connection('localhost', 27017, {
    auto_reconnect: true, 
    journal: true, 
    safe: false
}));

db.on('disconnected', function() {
    console.log('MongoDB disconnected');
}).on('error', function(err) {
    console.log('MongoDB error :( ' + err);
});

db.open(function(err, db) {
    if(!err) {

        console.log("Connected to '" + db.databaseName + "' database");

        db.collection('items', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'items' collection is empty.");
            }
        });
    }
});


module.exports = function(app){
     
    this.findAll = function(callback) {

        db.collection('items', function(err, collection) {
            collection.find().toArray(function(err, items) {
                callback(err, items);
            });
        });
    };

    this.findById = function(id, callback) {
        
        var res = null;
        console.log('Retrieving item: ' + id);

        db.collection('items', function(err, collection) {
            collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
                if (err){
                    console.log('Error :( ', err);
                    callback({
                        'error': 'An error has occurred :('
                    }, null);
                } else {
                    callback(null, item);
                }
                
            });
        });

        return res;
    };
     
    this.addItem = function(item, callback) {
  
        console.log('Adding item: ' + JSON.stringify(item));

        db.collection('items', function(err, collection) {
            collection.insert(item, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error :( ', err);
                    callback({
                        'error': 'An error has occurred :('
                    }, null);
                } else {
                    // console.log('Success!');
                    callback(null, result[0]);
                }
            });
        });
    }
     
    this.updateItem = function(id, item, callback) {

        var itemWithId = JSON.parse(JSON.stringify(item));;

        delete item._id; // http://stackoverflow.com/questions/14585507/mongodb-cant-update-document-because-id-is-string-not-objectid
        
        console.log('Updating item: ', JSON.stringify(itemWithId));

        db.collection('items', function(err, collection) {
            collection.update({'_id': new BSON.ObjectID(id)}, item, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error :( ', err);
                    callback({
                        'error': 'An error has occurred :('
                    }, null);
                } else {
                    // console.log('Success!');
                    callback(null, itemWithId);
                }
            });
        });
    }
     
    this.deleteItem = function(id, callback) {
        
        console.log('Deleting item: ' + id);

        db.collection('items', function(err, collection) {
            collection.remove({'_id': new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error :( ', err);
                    callback({
                        'error': 'An error has occurred'
                    }, null);
                } else {
                    // console.log('Success! ' + result + ' document' + ((result > 1) ? 's' : '') + ' deleted');
                    callback(null, id);
                }
            });
        });
    }

    if (app !== undefined){
        app.get('/items', function(req, res) {
            
            this.findAll(function(err, data){
                if (err) { console.log("Error :( ", err); }
                res.send(data);
            });
            
        }.bind(this));

        app.get('/items/:id', function(req, res){
            var id = req.params.id;
            this.findOne(id, function(err, data){
                if (err) { console.log("Error :( ", err); }
                res.send(data);
            });
        }.bind(this));

        app.post('/items',  function(req, res){
            var item = req.body;
            this.addItem(item, function(err, data){
                if (err) { console.log("Error :( ", err); }
                res.send(data);
            });
        }.bind(this));

        app.put('/items/:id', function(req, res){
            var id = req.params.id;
            var item = req.body;
            this.updateItem(id, item, function(err, data){
                if (err) { console.log("Error :( ", err); }
                res.send(data);
            });
            
        }.bind(this));

        app.delete('/items/:id', function(req, res){
            var id = req.params.id;
            this.deleteItem(id, function(err, data){
                if (err) { console.log("Error :( ", err); }
                res.send(data);
            });
        }.bind(this));
    } 



}; // module.exports

 


