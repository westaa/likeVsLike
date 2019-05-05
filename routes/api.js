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

function getDate () {
    var dt = new Date();
    var day = dt.getDate().toString().length === 1 ? "0" + dt.getDate() : dt.getDate();
    var month = dt.getMonth().toString().length === 1 ? "0" + (dt.getMonth() +1) : dt.getMonth() + 1;
    var date = dt.getFullYear().toString()  + month.toString() + day.toString();
    console.log("date", date);
    return date;
};

router.get('/nba', function (req, res, next) {
  rp.get('http://sportsdatabase.com/nba/query.JSON?sdql=line%2Ctotal%2Cpoints%2Cteam%2Co%3Ateam%2Co%3Apoints%2Csite%2Crest%2Co%3Arest%2Cdate%40date%3D' +
  getDate() +
  '&output=json&api_key=guest').then(function(data){
    var x = data.replace(/\'/g, '"');
    var y  = JSON.parse(x);
    siteFinder(y);
    res.send(y);
  }, function (error) {
    console.log('ERROR: ', error);
  })
});

router.get('/nba/matchup/:team/:oTeam',
  function(req, res, next) {
    rp.get('http://sportsdatabase.com/nba/query.JSON?sdql=WP%40season%3D2018%20and%20playoffs%3D0%20and%20team%3D' + req.params.oTeam + '&output=json&api_key=guest').then(function(data) {
      console.log("LINE 64: WINNING PERCENT: ", data);
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
      high = teamWP + 15;
      low = teamWP -12;
    }
    if (teamWP >= 70.0) {
      high = teamWP + 15;
      low = teamWP -12;
    }
    if (teamWP >= 80) {
      high = teamWP + 5;
      low = teamWP -25;
    }
    rp.get('http://sportsdatabase.com/nba/query.JSON?sdql=' + 'line%2Ctotal%2Cpoints%2Cteam%2Co%3Ateam%2Co%3Apoints%2Csite%2Crest%2Co%3Arest%2Cdate%40' + 'date%3E20181015%20and%20date%3C' + getDate() + '%20and%20site%3D' + isHomeTeam(req.params.team) +
    '%20and%20team%3D' + req.params.team + '%20and%20' + 'o%3AWP%3E' + low + '%20and%20' + 'o%3AWP%3C' + high + '&output=json&api_key=guest').then(function(data) {
      console.log("DATA: ", data);
      var x = data.replace(/\'/g, '"');
      var teamData = JSON.parse(x).groups[0].columns;
      var teamSite = teamData[6][teamData[6].length - 1];
      res.send(teamData);
    }, function(err) {
      console.error('ERR: ', err);
    });
  })
});

app.get('*', function(req, res) {
    res.redirect('/');
});

module.exports = router;
