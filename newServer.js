var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var json2csv = require('json2csv');
var fs = require('fs');
var fields = ['_id','id', 'reason'];
const dotenv = require('dotenv');
var CONTACTS_COLLECTION = "contacts";

var app = express();

var cors=require('cors');

app.use(cors({origin:false,credentials: false}));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));




dotenv.load({ path: '.env.example' });

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
// mongodb://ajajaj:laptopcom@ds133271.mlab.com:33271/test_user_user
// Connect to the database before starting the application server. 
// // var url = 'mongodb://localhost:27017/myproject';
mongodb.MongoClient.connect(process.env.MONGOLAB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/",function(req, res) {
  res.send('hello world');
})
app.get("/hello",function(req, res) {
  console.log('dsffffffffff');
  res.header("Access-Control-Allow-Origin", "*");

  res.send('hello fuckingworld');
})
app.get("/helloworld",function(req, res) {
  res.send('hello fuckingworld xxxxxx');
})
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  
  next();
});
app.post("/getRecords", function(req, res,next) {
  console.log('req');
  console.log('req');
  console.log(req);
  var fields=req.body;
  console.log('fields');
  console.log(fields);
  console.log('aj');
  var x= fields["data"];
  //console.log('xxx');
  console.log(x);

  var obj='Account';
  var allExistingData =[];
      db.collection(obj).find(function(err, results){
          if (err) {
            handleError(results, err.message, "Failed to get contact");
            //return res.send();
          } else {
            console.log('all stored recs');
            results.toArray(function(err, results){
              console.log('all stored recsfghfj');
                console.log(results); // output all records
                allExistingData = results;


                console.log('results length');
                console.log(allExistingData.length);
                console.log(x.length);

                if(allExistingData.length > 0){
                  if(x != undefined)
                  x.forEach(function(doc) {
                    if(doc.Id != undefined)
                    db.collection(obj).update(
                       {Id:doc.Id},
                       doc,
                       { upsert: true }
                    );
                    
                });
                }
                else{
                  console.log('inside else');
                  db.collection(obj).insert(x, function(err, doc) {
                    if (err) {
                      handleError(res, err.message, "Failed to create new contact.");

                      //res.header("Access-Control-Allow-Origin", "*");
                      //return res.send();
                    } else {
                      //res.header("Access-Control-Allow-Origin", "*");
                      //return res.send(doc);
                    }
                  });
                }
            });
          }
      });
      
      

  res.header("Access-Control-Allow-Origin", "*");
  res.send(fields);
   
  next();
});





















/*const express = require('express')
const bodyParser = require('body-parser')
 
// Create a new instance of express
const app = express()
 app.use(bodyParser.json()); 
// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }))
 
// Route that receives a POST request to /sms
app.post('/sms', function (req, res) {
  const body = req.body;
  console.log('xvxv');
  console.log(body);
  res.set('Content-Type', 'text/plain')
  res.send(`You sent: ${body} to Express`)
})
 
// Tell our app to listen on port 3000
app.listen(3000, function (err) {
  if (err) {
    throw err
  }
 
  console.log('Server started on port 3000')
})*/
