const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const path = require('path')
const router = express.Router()
const mongodb = require ('mongodb')
const MongoClient = require('mongodb').MongoClient
const cors = require("cors")

let listenPort = process.env.PORT || 8080
let url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
let dbName = 'heroku_792tmcjw'; 
let collectionName = 'sentence'

let distPath = path.join(__dirname, '..', 'dist')

let corsOption = {
  origin: 'localhost:' + listenPort  
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/testPost',cors(corsOption),function(req,res){
  console.log(`req: ${req}`)
  res.json('test post received')
})

app.use('/testDb',cors(corsOption),function(req,res){
  console.log("testDb")
  console.log(`url: ${url}`)
  
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    console.log(`url: ${url}`)
    console.log(`err: ${err}`)
    console.log(JSON.stringify(req.body))
    
    const db = client.db(dbName)
    const collection = db.collection(collectionName)
    collection.find({}).toArray(function(err,docs){
      res.json(docs)
    })
  });
})

app.use('/delete', cors(corsOption), function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
      console.log(`req body: ${JSON.stringify(req.body)}`)
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      collection.deleteOne({_id : new mongodb.ObjectID(req.body.id)}, function(err, result) {
        console.log(`Removed the document with the field _id: ${req.body.id}`);
        res.json(result);
      })
    });
})

app.use('/load',  cors(corsOption), function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    const db = client.db(dbName)
    const collection = db.collection(collectionName)
    collection.find({}).toArray(function(err,docs){
      res.json(docs)
    })
  })
})

app.use('/create', cors(corsOption), function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
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

app.use(express.static(distPath))
app.listen(listenPort)