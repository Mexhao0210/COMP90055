var express = require('express');
var bodyParser = require('body-parser');
const mongoUrl = "mongodb://34.71.128.247:27017/";

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use('*',function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*'); 
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');//设置方法
        if (req.method == 'OPTIONS') {
          res.send(200); // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
        }
        else {
          next();
        }
      });


app.get('/getprod', (req, res) => {
    // res.header('Access-Control-Allow-Origin', '*');
    findMongo(req.query.id,res);
});

app.get('/getprodByOwner', (req, res) => {
    // res.header('Access-Control-Allow-Origin', '*');
    findProds(req.query.owner,res);
});

app.post('/addprod', (req, res) => {
    // res.header('Access-Control-Allow-Origin', '*');
    result = insertMongo(req.body.data,res);
});

app.post('/updateprod', (req, res) => {
    // res.header('Access-Control-Allow-Origin', '*');
    result = updateMongo(req.body.id, req.body.key, req.body.val,res);
});

app.post('/login', (req, res) => {
    // res.header('Access-Control-Allow-Origin', '*');
    result = checkUser(req.body.username, req.body.password,res);
});

app.get('/register', (req, res) => {
    // res.header('Access-Control-Allow-Origin', '*');
    result = register(req.query.username, req.query.password,res);
});

app.listen(PORT, HOST);

function insertMongo(data, response) {
    console.log(data);
    var MongoClient = require('mongodb').MongoClient;
    var url = mongoUrl;
 
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("prod");
    var myobj = data;
    dbo.collection("site").insertOne(myobj, function(err, res) {
        if (err) {
            response.send({status:1});
            throw err;
        }
        db.close();
        console.log(JSON.stringify(res));
        response.send({status:0});
    });
  });
}

function updateMongo(key, item, val, response) {
    if(key === undefined || item === undefined) {
        response.send({status:1});
    }
    var MongoClient = require('mongodb').MongoClient;
    var url = mongoUrl;
     
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("prod");
        var whereStr = {"id":key};  // 查询条件
        // var updateStr = JSON.parse("{\'$set\': {\'" + item + "\':" + val + "}}");
        var updateStr = JSON.parse("{\"$set\":{\""+item+"\":\""+val+"\"}}");
        dbo.collection("site").updateOne(whereStr, updateStr, function(err, res) {
            if (err) {
                response.send({status:1});
                throw err;
            }
            db.close();
            response.send({status:0});
        });
    });
}

function findMongo(key,res) {
    if(key === undefined) {
        response.send({status:1});
    }
    var MongoClient = require('mongodb').MongoClient;
    var url = mongoUrl;
    var result = ""
 
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("prod");
    var whereStr = {"id":key};  // 查询条件
    dbo.collection("site").find(whereStr).toArray(function(err, result) {
        if (err) {
            res.send({status:1});
            throw err;
        }
        db.close();
        res.send(result[0]);
    });
  });
}

function findProds(owner,res) {
    if(owner === undefined) {
        res.send({status:1});
    }
    var MongoClient = require('mongodb').MongoClient;
    var url = mongoUrl;
    var result = ""
 
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("prod");
    var whereStr = {
        owner : owner
    };  // 查询条件
    dbo.collection("site").find(whereStr).toArray(function(err, result) {
        if (err) {
            res.send({status:1});
            throw err;
        }
        db.close();
        res.send(result);
    });
  });
}

function checkUser(username, password, res) {
    if(username === undefined || password === undefined) {
        response.send({status:1});
    }
    var MongoClient = require('mongodb').MongoClient;
    var url = mongoUrl;
    var result = 0
 
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("user");
    var whereStr = {"username":username,"password":password.toString()}; 
    dbo.collection("site").findOne(whereStr, function(err, result) {
        if (err) {
            res.send({status:1});
            throw err;
        }
        db.close();
        console.log(result);
        if(result == undefined) {
            res.send({status:1, data:null});
        } else {
            res.send({status:0, data:result});
        }
    });
  });
}

function register(username, password, response) {
    if(username === undefined || password === undefined) {
        response.send({status:1});
    }
    var MongoClient = require('mongodb').MongoClient;
    var url = mongoUrl;
 
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("user");
    var checkWhereStr = {"username":username};
    dbo.collection("site").countDocuments(checkWhereStr, function(err, result){
        if (err) {
            response.send("{status:1}");
            throw err;
        }
        if (result>0) {
            response.send(JSON.stringify({"status":1, "msg":"username exist"}));
        } else {
            var newUser = {"username":username, "password":password};
            dbo.collection("site").insertOne(newUser, function(err, result) {
                if (err) {
                    response.send("{status:1}");
                    throw err;
                }
                db.close();
                response.send("{status:0}");
            })
        }
    });
    });
}



