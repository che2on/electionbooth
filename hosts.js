var express = require('express');
var app = express();

app
.use(express.vhost('electionbooth.in', require('./electionbooth/elections.js').app))
.listen(80);
