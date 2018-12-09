var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){

  $locationProvider.html5Mode(true);

  $stateProvider

    .state({
      url: '/',
      name: 'home',
      transclude: true,
      component: 'home'
    })

    .state({
      url: 'likeVsLike/?team&oTeam',
      name: 'likeVsLike',
      component: 'likeVsLike'
    })

});

app.run(['$rootScope', '$state', '$stateParams',
  function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}])
