const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const path = require('path')
const router = express.Router()
const mongodb = require ('mongodb')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert');
const cors = require("cors")

let url = 'mongodb://localhost:27017';
let dbName = 'project'; 
let collectionName = 'sentence'

let distPath = path.join(__dirname, '..', 'dist')

let corsOption = {
  origin: 'localhost:8080' 
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/delete', cors(corsOption), function (req, res) {
  MongoClient.connect(url, function(err, client) {
      console.log(JSON.stringify(req.body))
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      collection.deleteOne({_id : new mongodb.ObjectID(req.body.id)}, function(err, result) {
        console.log(`Removed the document with the field _id: ${req.body.id}`);
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        res.json(result);
      })
    });
})

app.use('/create', cors(corsOption), function (req, res) {
  MongoClient.connect(url, function(err, client) {
      console.log(JSON.stringify(req.body))
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      let data = req.body;
      console.log(`data: ${JSON.stringify(data)}`)
      collection.insertMany(data.arrSentence, function(err, result) {
        res.json(result)
      })
    });
})

app.use('/testPost', cors(corsOption), function (req, res) {
    console.log(`${JSON.stringify(req.body)}`)
    console.log(req.body.a)
    console.log(req.body.b)
    res.send('POST request to homepage')
})
app.use(express.static(distPath))

function insertDocuments(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
      {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
      assert.equal(err, null);
      assert.equal(3, result.result.n);
      assert.equal(3, result.ops.length);
      console.log("Inserted 3 documents into the collection");
      callback(result);
    });
  }

function performInsert(){ 
    MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    
    const db = client.db(dbName);
    
    insertDocuments(db, function() {
        client.close();
    });
    });
}



app.listen(8080)