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

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());




dotenv.load({ path: '.env.example' });
/*
Whole salesforce code
 */

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


app.post("/getRecords", function(req, res) {
  console.log('geetting data');
  console.log(req.body);
  var fields=req.body;
  
  setTimeout(function() {
    var x= fields["data"];
    var obj='Account';
    
      var allExistingData =[];
      db.collection(obj).find(function(err, results){
          if (err) {
            handleError(results, err.message, "Failed to get contact");
          } else {
            console.log('all stored recs');
            results.toArray(function(err, results){
              console.log('all stored recsfghfj');
                console.log(results); // output all records
                allExistingData = results;


                console.log('results length');
                console.log(allExistingData.length);
                if(allExistingData.length > 0)
                  fields.forEach(function(doc) {
                    db.collection(obj).update(
                       {Id:doc.Id},
                       doc,
                       { upsert: true }
                    );
                    
                });
                else{
                  console.log('inside else');
                  db.collection(obj).insert(fields, function(err, doc) {
                    if (err) {
                      handleError(res, err.message, "Failed to create new contact.");
                    } else {
                      res.status(201).json(doc);
                    }
                  });
                }
            });
          }
      });
      
      

        
      res.status(201).json(fields);
    }, 3000);

});

