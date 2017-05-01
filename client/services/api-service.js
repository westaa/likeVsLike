app.service('apiService', function($http) {

  return {

    getNBAMatchups: function () {
     return $http({
        method: 'GET',
        dataType: 'json',
        url: '/api/nba/'
      }).then(function(data) {
        data = data.data.groups[0].columns;
        data = {
          pointSpread: data[0],
          total: data[1],
          team: data[3],
          oTeam: data[4],
          teamSite: data[6],
          teamRest: data[7],
          oTeamRest: data[8],
          date: data[9]
        };
        return data;
      })
    },

    uniformArrSize: function (data) {
      var self = this;
      for(var x in data) {
        if(data[x].length > self.removeNullArrValues(data[2]).length) {
          data[x].pop()
        }
      }
      return data
    },

    getMatchupData: function (team, oTeam) {
      var self = this;
      return $http({
        method: 'GET',
        dataType: 'json',
        url: '/api/nba/matchup/' + team + '/' + oTeam
      }).then(function(data) {
        data = self.uniformArrSize(data.data);
        var aggregateData = {
          averageTotal: self.getAvgSingleArr(data[1]),
          averagePoints: self.getAvgSumTwoArr(data[2], data[5]),
          averageSpread: self.getAvgSingleArr(data[0]),
          averageATSPerformance: self.getAvgATSPerformance(data[2], data[5], data[0]),
        };
        data = {
          pointSpread: data[0],
          total: data[1],
          teamPoints: data[2],
          oTeamPoints: data[5],
          team: data[3],
          oTeam: data[4],
          teamSite: data[6],
          teamRest: data[7],
          oTeamRest: data[8],
          date: data[9]
        };
        data.aggregateData = aggregateData;
        return data
      })
    },

    removeNullArrValues: function (arr) {
      return arr.filter(function(elem, ind) {
        return elem !== null;
      })
    },

    getAvgSingleArr: function (arr) {
    if (typeof arr !== 'object'){
      return 'no data';
    }
    var arr = arr;
    var avg = Math.round(arr.filter(
      function(elem, ind) {
      return elem !== 'no data' ;
     }).reduce(function(a,b){
       return a + b;
     })/arr.filter(function(elem, ind) {
       return elem !== 'no data' || elem !== null ;
     }).length * 100) / 100;
     return avg;
    },

    getAvgATSPerformance: function(teamPoints, oPoints, pointSpread) {
      var avgMargin = this.getAvgDiffTwoArr(teamPoints, oPoints);
      return avgMargin + this.getAvgSingleArr(pointSpread);
    },

    getAvgDiffTwoArr: function (arr, arr2) {
      if (typeof arr !== 'object'){
        return 'no data';
      }
      var arr = arr;
      var arr2 = arr2;
      var avg = Math.round((arr.filter(function(elem, ind) {
        return elem != 'no data'
      }).reduce(function(a,b) {
         return a + b
       }) - arr2.filter(function(elem, ind){
         return elem !== 'no data'
       }).reduce(function(a,b) {
         return a + b
       }))/arr.filter(function(elem, ind) {
         return elem != 'no data' || elem !== null;
       }).length * 100) / 100;
       return avg;
    },

    getAvgSumTwoArr: function (arr, arr2) {
      if (typeof arr !== 'object'){
        return 'no data';
      }
      var arr = arr;
      var arr2 = arr2;
      var avg = Math.round((arr.filter(function(elem, ind) {
        return elem != 'no data'
      }).reduce(function(a,b) {
         return a + b
       }) + arr2.filter(function(elem, ind){
         return elem !== 'no data'
       }).reduce(function(a,b) {
         return a + b
       }))/arr.filter(function(elem, ind) {
         return elem != 'no data' || elem !== null;
       }).length * 100) / 100;
       return avg;
    }

  }

});
