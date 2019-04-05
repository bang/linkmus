const express = require('express');
var favicon = require('serve-favicon');
const app = express();
const router = express.Router();

const path = __dirname + '/views/';
var port = process.env.LINKMUSIK_HTTP_PORT || 8088;


router.use(function (req,res,next) {
  console.log('/' + req.method);
  next();
});

router.get('/', function(req,res){
  res.sendFile(path + 'index.html');
});


// declare public directory to be used as a store for static files
app.use('/mp3', express.static(__dirname + '/mp3'));

app.use('/mp3Test', express.static(__dirname + '/mp3Test'));

// JS code( non-theme )
app.use('/js', express.static(__dirname + '/js'))

// JSON database files, config etc.
app.use('/resources', express.static(__dirname + '/resources'))


app.use('/img', express.static(__dirname + '/img'))


app.use(express.static(path));

// site root
app.use('/', router);

//favicon
app.use(favicon(__dirname + '/favicon.ico'));

app.listen(port, function () {
  console.log('Example app listening on port ' + port)
})
