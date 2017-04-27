app.component('likeVsLike', {
  templateUrl: './components/likeVsLike.component.html',
  controller: likeVsLikeController,
  bindings: '=',
});

likeVsLikeController.$inject = ['$http', '$scope', 'apiService', '$stateParams'];

function likeVsLikeController($http, $scope, apiService, $stateParams) {
  this.$onInit = onInit;

  function onInit() {
    this.team = $stateParams.team;
    this.oTeam = $stateParams.oTeam;
    this.matchupData = apiService.getMatchupData($stateParams.team, $stateParams.oTeam);
    this.oMatchupData = apiService.getMatchupData($stateParams.oTeam, $stateParams.team);
    console.log(this.matchupData);
    // this.averageTotal =
    // this.averagePoints =
    // this.averagePointSpread =
    // this.averageATSPerformance =
  }
}
