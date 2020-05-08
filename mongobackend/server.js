const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/getprod', (req, res) => {
    findMongo(req.query.id,res);
});

app.get('/addprod', (req, res) => {
    result = insertMongo(req.query.id, req.query.val,res);
});

app.get('/updateprod', (req, res) => {
    result = updateMongo(req.query.id, req.query.key, req.query.val,res);
});

app.listen(PORT, HOST);

function insertMongo(key, val, response) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://34.71.128.247:27017/";
 
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("prod");
    var myobj = { id: key, value: val };
    dbo.collection("site").insertOne(myobj, function(err, res) {
        if (err) {
            response.send("{status:1}");
            throw err;
        }
        db.close();
        console.log(JSON.stringify(res));
        response.send("{status:0}");
    });
  });
}

function updateMongo(key, item, val, response) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://34.71.128.247:27017/";
     
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("prod");
        var whereStr = {"id":key};  // 查询条件
        // var updateStr = JSON.parse("{\'$set\': {\'" + item + "\':" + val + "}}");
        var updateStr = JSON.parse("{\"$set\":{\""+item+"\":\""+val+"\"}}");
        dbo.collection("site").updateOne(whereStr, updateStr, function(err, res) {
            if (err) {
                response.send("{status:1}");
                throw err;
            }
            db.close();
            response.send("{status:0}");
        });
    });
}

function findMongo(key,res) {
    console.log(key)
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://34.71.128.247:27017/";
    var result = ""
 
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("prod");
    var whereStr = {"id":key};  // 查询条件
    dbo.collection("site").find(whereStr).toArray(function(err, result) {
        if (err) {
            res.send("{status:1}");
            throw err;
        }
        db.close();
        res.send(JSON.stringify(result[0]));
    });
  });
}



