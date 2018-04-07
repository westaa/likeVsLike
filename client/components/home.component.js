app.component('home', {
  templateUrl: './components/home.component.html',
  controller: homeController,
  bindings: {}
});

homeController.$inject = ['$http', 'apiService', '$stateParams', '$state'];

function homeController($http, apiService, $stateParams, $state) {

  this.$onInit = onInit;
  this.selected = undefined;

  function onInit() {

    this.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
    'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma',
    'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'];

    this.NBAData = apiService.getNBAMatchups();
  }

}
