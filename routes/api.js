var express = require('express');
var app = express();
var router = express.Router();
var rp = require('request-promise');
var day = new Date().toString().split(' ')[2];
var day2 = parseInt(day) + 1;
var monthText = new Date().toString().split(' ')[1];
var monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var numberMonthArr = ['01','02','03','04','05','06','07','08','09','10','11','12'];
var month = [];

function monthFinder () {
  for (var i = 0; i < monthArr.length; i++) {
    if (monthArr[i] == monthText) {
      month.push(numberMonthArr[i]);
    }
  }
}

router.get('/nba', function (req, res, next) {
  monthFinder();
  rp.get('http://api.sportsdatabase.com/nba/query.JSON?sdql=line%2Ctotal%2Cpoints%2Cteam%2Co%3Ateam%2Co%3Apoints%2Csite%2Crest%2Co%3Arest%2Cdate%40date%3E%3D2017' +
  month[0] + day +
  '&output=json&api_key=guest').then(function(data){
    var x = data.replace(/\'/g, '"');
    var y  = JSON.parse(x);
    res.send(y);
  })
});

router.get('/nba/matchup/:team/:oTeam',
  function(req, res, next) {
    rp.get('http://api.sportsdatabase.com/nba/query.JSON?sdql=WP%40season%3D2016%20and%20team%3D' + req.params.oTeam + '&output=json&api_key=guest').then(function(data) {
    var x = data.replace(/\'/g, '"');
    var teamWP  = JSON.parse(x).groups[0].columns[0][0];
      var high = teamWP + 10;
      var low = teamWP - 10;
      rp.get('http://api.sportsdatabase.com/nba/query.JSON?sdql=' + 'line%2Ctotal%2Cpoints%2Cteam%2Co%3Ateam%2Co%3Apoints%2Csite%2Crest%2Co%3Arest%2Cdate%40season%3D2016' +
      '%20and%20team%3D' + req.params.team + '%20and%20' + 'o%3AWP%3E' + low + '%20and%20' + 'o%3AWP%3C' + high + '&output=json&api_key=guest').then(function(data) {
        var x = data.replace(/\'/g, '"');
        var teamData = JSON.parse(x).groups[0].columns;
        res.send(teamData);
      });
    })
});

app.get('*', function(req, res) {
    res.redirect('/');
});

module.exports = router;
