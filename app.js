var express    = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));

var api = require('./routes/api')
app.use('/api', api);

app.listen(process.env.PORT || 3000);
