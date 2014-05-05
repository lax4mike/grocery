var mongo = require('mongodb');
 
var Connection = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var db = new Db('itemdb', new Connection('localhost', 27017, {
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
        console.log("Connected to 'itemdb' database");
        db.collection('items', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'items' collection is empty.");
            }
        });
    }
});


module.exports = function(app){

    this.findById = function(req, res) {
        var id = req.params.id;
        console.log('Retrieving item: ' + id);

        db.collection('items', function(err, collection) {
            collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
                res.send(item);
            });
        });
    };
     
    this.findAll = function(req, res) {
        db.collection('items', function(err, collection) {
            collection.find().toArray(function(err, items) {
                res.send(items);
            });
        });
    };
     
    this.addItem = function(req, res) {

        var item = req.body;
        console.log('Adding item: ' + JSON.stringify(item));

        db.collection('items', function(err, collection) {
            collection.insert(item, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error :( ', err);
                    res.send({
                        'error': 'An error has occurred :('
                    });
                } else {
                    // console.log('Success!');
                    res.send(result[0]);
                }
            });
        });
    }
     
    this.updateItem = function(req, res) {
        var id = req.params.id;
        var item = req.body;

        delete item._id; // http://stackoverflow.com/questions/14585507/mongodb-cant-update-document-because-id-is-string-not-objectid
        
        console.log('Updating item: ' + JSON.stringify(item));

        db.collection('items', function(err, collection) {
            collection.update({'_id': new BSON.ObjectID(id)}, item, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error :( ', err);
                    res.send({
                        'error': 'An error has occurred :('
                    });
                } else {
                    // console.log('Success!');
                    res.send(item);
                }
            });
        });
    }
     
    this.deleteItem = function(req, res) {
        var id = req.params.id;
        console.log('Deleting item: ' + id);

        db.collection('items', function(err, collection) {
            collection.remove({'_id': new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error :( ', err);
                    res.send({
                        'error': 'An error has occurred'
                    });
                } else {
                    // console.log('Success! ' + result + ' document' + ((result > 1) ? 's' : '') + ' deleted');
                    res.send(req.body);
                }
            });
        });
    }

        app.get('/items', this.findAll);
        app.get('/items/:id', this.findById);
        app.post('/items', this.addItem);
        app.put('/items/:id', this.updateItem);
        app.delete('/items/:id', this.deleteItem);



}; // module.exports

 


