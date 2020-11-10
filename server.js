// server.js
// where your node app starts

const checkIfIsUnix = str => parseInt(str).toString() === str

// init project
var express = require('express');
var app = express();
const PORT = process.env.PORT || 4000

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json())

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//mounting /api/:date-str route
app.param("data_str", (req, res, next, id) => {
  let timeStr = '';
  const isUnix = checkIfIsUnix(id)
  if (isNaN(Date.parse(id)) && !isUnix){
    timeStr = 'error';
  } else {
    timeStr = id
    req.body.is_unix = isUnix
  }
  req.body.time_str = timeStr
  next()
})

app.get('/api/timestamp/', (req, res) => {
  const date = new Date()
  res.json({'unix': date.getTime(), 'utc': date.toUTCString()})
})

app.get('/api/timestamp/:data_str', (req, res) => {
  const timeStr = req.body.time_str
  let date;
  if (timeStr === 'error'){
    return res.json({'error': 'Invalid Date'})
  } else if (req.body.is_unix){
    date = new Date(parseInt(timeStr))
  } else {
    date = new Date(timeStr)
  }
  res.json({
    'unix': date.getTime(),
    'utc': date.toUTCString()
  })
})

// listen for requests :)
var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
