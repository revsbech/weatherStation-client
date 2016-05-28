'use strict';


// Declare app level module which depends on views, and components
var WeatherApp = angular.module('WeatherApp', [
  'ui.router',
  'ui.bootstrap',
  'WeatherApp.version'
]);

WeatherApp.config(function ($stateProvider, $urlRouterProvider) {
  // UI Routing
  $urlRouterProvider.otherwise("/view1"); // If url not found redirect to dashboard

  $stateProvider
    // Independent Login Template
    .state('view1', {
      url: '/view1',
      templateUrl: 'views/view1.html',
      controller: 'View1Controller',
    })
    .state('view2', {
      url: '/view1',
      templateUrl: 'views/view2.html',
      controller: 'View2Controller',
    })

});
