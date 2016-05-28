'use strict';

WeatherApp.controller("View1Controller", function($scope, APIservice) {
  var startTime = moment().subtract(24 , 'hours');
  var endTime = moment();
  $scope.deviceId = "jer-greenhouse01";
  $scope.frequency = "minute";
  $scope.startDate = startTime;
  $scope.stopDate = endTime;

  APIservice.getSamples($scope.deviceId, $scope.equipment, $scope.frequency, $scope.startDate, $scope.stopDate).then(function (graphData) {
    $scope.graphData = graphData;
  });
});