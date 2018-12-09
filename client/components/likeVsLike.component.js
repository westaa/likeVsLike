app.component('likeVsLike', {
  templateUrl: './components/likeVsLike.component.html',
  controller: likeVsLikeController,
  bindings: '=',
});

likeVsLikeController.$inject = ['$http', '$scope', 'apiService', '$stateParams', '$state'];

function likeVsLikeController($http, $scope, apiService, $stateParams, $state) {

  var $ctrl = this;

  $ctrl.$onInit = onInit;

  function onInit() {
    $ctrl.loading = true;
    $ctrl.team = $stateParams.team;
    $ctrl.oTeam = $stateParams.oTeam;


    apiService.getMatchupData($stateParams.team, $stateParams.oTeam).then(function(data){
      $ctrl.matchupData = data;
      $ctrl.loading = false;
    })
    apiService.getMatchupData($stateParams.oTeam, $stateParams.team).then(function(data) {
      $ctrl.oMatchupData = data;
    })
  }

}
