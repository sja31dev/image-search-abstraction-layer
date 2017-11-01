var express = require('express');
var app = express();
var GoogleImages = require('google-images');
var client = new GoogleImages(process.env.SEI, process.env.API_KEY);

// Store the history locally.
// No persistance but is limited to 10 below so wont leak either.
// Could be implemented using a DB of some sort.
var history = [];

app.get('/api/imagesearch/:search', function(req, res) {
  try {
    var offset = req.query.offset || 1;
    if (offset < 1) {
      offset = 1;
    }
    //console.log('"' + req.params.search + '" offset: ' + offset);
    client.search(req.params.search, {page: offset})
      .then(images => {
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
      
      // unshift the query onto the front of the history
      var now = new Date();
      var new_history = {
        term: req.params.search,
        when: now.toISOString()
      };
      history.unshift(new_history);
      
      // pop the oldest query off the end of the history if there are less than 10
      if (history.length > 10) {
        history.pop();
      }
    });
    //res.send(req.params.search + " " + req.query.offset);
  } catch (e) {
    // This could be more user friendly
    res.sendStatus(500);
  }
});
  
app.get('/api/latest/imagesearch/', function(req, res) {
  try {
    // Send the history
    res.json(history);
  } catch (e) {
    // This could be more user friendly
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

