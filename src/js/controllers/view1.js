'use strict';

WeatherApp.controller("View1Controller", function($scope, APIservice) {
  var startTime = moment().subtract(24 , 'hours');
  var endTime = moment();
  $scope.deviceId = "jer-greenhouse01";
  $scope.frequency = "minute";
  $scope.startDate = startTime;
  $scope.stopDate = endTime;


});