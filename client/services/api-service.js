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

    getAvgPointsScored (points, oPoints) {
      var self = this;
      return self.getArrAvg(self.filterNull(points)) + self.getArrAvg(self.filterNull(oPoints))
    },

    filterNull(arr){
      return arr.filter(function(elem) {
        return elem !== null
      })
    },

    getArrAvg (arr) {
      return arr.reduce(function(a,b){
        return a + b;
      })/arr.length;
    },

    getAvgSpread(spreadArr, pointsArr) {
      var self = this;
      var spreadArr = self.uniformArrSize(pointsArr, spreadArr);
      return self.getArrAvg(spreadArr);
    },

    getAvgTotal (totalArr, pointsArr) {
      var self = this;
      var totalArr = self.uniformArrSize(pointsArr, totalArr);
      return self.getArrAvg(self.filterNull(totalArr));
    },

    getMatchupData: function (team, oTeam) {
      var self = this;
      return $http({
        method: 'GET',
        dataType: 'json',
        url: '/api/nba/matchup/' + team + '/' + oTeam
      }).then(function(data) {
        var data = data.data;
        var aggregateData = {
          averageTotal: self.getAvgTotal(data[1], data[2]),
          averagePoints: self.getAvgPointsScored(data[2], data[5]),
          averageSpread: self.getAvgSpread(data[0], data[2]),
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

    uniformArrSize (arr, arr2) {
      var self = this;
      if (arr2.length > self.filterNull(arr).length) {
        arr2.pop();
        self.uniformArrSize(arr, arr2);
      }
      return arr2;
    },

    getAvgATSPerformance: function(teamPoints, oPoints, pointSpread) {
      var self = this;
      var pointSpread = self.uniformArrSize(teamPoints, pointSpread);
      return self.getArrAvg(self.filterNull(teamPoints)) - self.getArrAvg(self.filterNull(oPoints)) + self.getArrAvg(self.filterNull(pointSpread))
    },
  }

});
