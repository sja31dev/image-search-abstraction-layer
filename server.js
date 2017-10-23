var fs = require('fs');
var express = require('express');
var app = express();
var GoogleImages = require('google-images');
var client = new GoogleImages(process.env.SEI, process.env.API_KEY);
var mongo = require('mongodb').MongoClient;

//var MONGODB = 'mongodb://' + process.env.DBUSER + ':' + process.env.DBPWD + '@' + process.env.DBSERVER + ':' + process.env.DBPORT + '/' + process.env.DBNAME;
var collection;
// The next short url value to use.
// If this is 0 it hasn't been initialised and the
// database connection isn't ready to use
var nextShortUrl = 0;

// !!! Change some of this to work with promises w=rather than chaining callbacks

/*function dbConnect() {
  mongo.connect(MONGODB, (err, db) => {
    if (err) {
      throw err; // Should be handled better
    }
    collection = db.collection(process.env.DBCOLLECTION);
    collection.ensureIndex("short_url", {unique: true}, function(err, name) {
      if (err) {
        throw err;
      }
      collection.count({}, function(err, count) {
        if (err) {
          throw err;
        }
        console.log(count + " documents found in database");
        if (count === 0) {
          nextShortUrl = count + 1;
          console.log("DB entries NOT found. Next short_url: " + nextShortUrl);
        } else { 
          var options = { "sort": [['short_url','desc']] }
          var a = collection.findOne({}, options, function(err, doc) {
            if (err) {
              throw err;
            }
            nextShortUrl = doc.short_url + 1;
            console.log("DB entries found. Next short_url: " + nextShortUrl);
          });
        }
      });
    });
  });
}

dbConnect();*/

app.get('/api/mediasearch/:search', function(req, res) {
  try {
    var offset = req.query.offset || 1;
    if (offset < 1) {
      offset = 1;
    }
    console.log('"' + req.params.search + '" offset: ' + offset);
    client.search(req.params.search, {page: offset})
      .then(images => {
      console.log(images.length);
      var ans = [];
      for (var i = 0; i < images.length; i++) {
        var img = {
          url: images[i].url,
          snippet: images[i].description,
          thumbnail: images[i].thumbnail.url,
          context: images[i].parentPage
        };
        ans.push(img);
      }
      res.json(ans);
    });
    //res.send(req.params.search + " " + req.query.offset);
  } catch (e) {
    // This could be more user friendly
    res.sendStatus(500);
  }
});
  
app.get('/api/latest/imagesearch/', function(req, res) {
  try {
    var short_url_id = parseInt(req.params.short_url_id + '');
    if (collection) {
      collection.find({short_url : short_url_id})
        .toArray((err, docs) => {
        if (err) {
          throw err;
        } 
        if (docs.length > 0) {
          res.redirect(docs[0].url);
        } else {
          res.json({
            error: "URL not found in the database"
          });
        }
      });
    } else {
      res.json({
        error: "No database connection"
      })
    }
    
  } catch (e) {
    res.sendStatus(500);
  }
});

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

