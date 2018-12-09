app.component('home', {
  templateUrl: './components/home.component.html',
  controller: homeController,
  bindings: {}
});

homeController.$inject = ['$http', 'apiService', '$stateParams', '$state', '$rootScope'];

function homeController($http, apiService, $stateParams, $state, $rootScope) {

  var $ctrl = this;
  $ctrl.$onInit = onInit;
  $ctrl.selected = undefined;

  function onInit() {
    $ctrl.NBAData = apiService.getNBAMatchups();
  }

}
