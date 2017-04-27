app.component('home', {
  templateUrl: './components/home.component.html',
  controller: homeController,
  bindings: {}
});

homeController.$inject = ['$http', 'apiService', '$stateParams', '$state'];

function homeController($http, apiService, $stateParams, $state) {

  this.$onInit = onInit;

  function onInit() {

    this.NBAData = apiService.getNBAMatchups();
  }
  
}
