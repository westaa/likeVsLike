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
var teamSites = {
  home: [],
  away: []
};

function monthFinder () {
  for (var i = 0; i < monthArr.length; i++) {
    if (monthArr[i] == monthText) {
      month.push(numberMonthArr[i]);
    }
  }
}

function siteFinder (data) {
  for (var i = 0; i < data.groups[0].columns[4].length; i++) {
    if(i % 2 === 0) {
      teamSites.home.push(data.groups[0].columns[3][i]);
    }
    else {
      teamSites.away.push(data.groups[0].columns[3][i]);
    }
  }
}

function isHomeTeam (team) {
  for (var i = 0; i < teamSites.home.length; i++) {
    if (teamSites.home[i] === team) {
      return 'home'
    } else if (teamSites.away[i] === team) {
      return 'away'
    }
  }
}

router.get('/nba', function (req, res, next) {
  monthFinder();
  rp.get('http://api.sportsdatabase.com/nba/query.JSON?sdql=line%2Ctotal%2Cpoints%2Cteam%2Co%3Ateam%2Co%3Apoints%2Csite%2Crest%2Co%3Arest%2Cdate%40date%3D2018' +
  month[0] + day +
  '&output=json&api_key=guest').then(function(data){
    var x = data.replace(/\'/g, '"');
    var y  = JSON.parse(x);
    siteFinder(y);
    res.send(y);
  })
});

router.get('/nba/matchup/:team/:oTeam',
  function(req, res, next) {
    rp.get('http://api.sportsdatabase.com/nba/query.JSON?sdql=WP%40season%3D2017%20and%20team%3D' + req.params.oTeam + '&output=json&api_key=guest').then(function(data) {
    var x = data.replace(/\'/g, '"');
    var teamWP  = JSON.parse(x).groups[0].columns[0][0];
    var high = teamWP + 10;
    var low = teamWP - 10;
    if (teamWP <= 40) {
      high = teamWP + 15;
      low = teamWP - 10;
    }
    if (teamWP >= 60.0) {
      high = teamWP + 10;
      low = teamWP -12.5;
    }
    if (teamWP >= 65.0) {
      high = teamWP + 10;
      low = teamWP -15;
    }
    if (teamWP >= 70.0) {
      high = teamWP + 10;
      low = teamWP -22;
    }
    if (teamWP >= 80) {
      high = teamWP + 5;
      low = teamWP -30;
    }
    rp.get('http://api.sportsdatabase.com/nba/query.JSON?sdql=' + 'line%2Ctotal%2Cpoints%2Cteam%2Co%3Ateam%2Co%3Apoints%2Csite%2Crest%2Co%3Arest%2Cdate%40season%3D2017' + '%20and%20date%3E20170218' + '%20and%20site%3D' + isHomeTeam(req.params.team) +
    '%20and%20team%3D' + req.params.team + '%20and%20' + 'o%3AWP%3E' + low + '%20and%20' + 'o%3AWP%3C' + high + '&output=json&api_key=guest').then(function(data) {
      var x = data.replace(/\'/g, '"');
      var teamData = JSON.parse(x).groups[0].columns;
      var teamSite = teamData[6][teamData[6].length - 1];
      res.send(teamData);
    });
  })
});

app.get('*', function(req, res) {
    res.redirect('/');
});

module.exports = router;
