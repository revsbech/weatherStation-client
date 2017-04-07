'use strict';

WeatherApp.controller("View1Controller", function($scope, APIservice, $timeout) {
  $scope.deviceId = "greenhouse01";
  $scope.reloadInterval = 60000;
  $scope.frequency = "minute";
  $scope.offsetHours = 24;
  $scope.startDate = moment().subtract($scope.offsetHours , 'hours');
  $scope.stopDate = moment();


  $scope.setOffsetHours = function(offset) {
    //$scope.frequency = "minute";
    if (offset > 24*90) {
      $scope.frequency = "week";
    } else if (offset > 24) {
      $scope.frequency = "hour";
    } else {
      $scope.frequency = "minute";
    }
    $scope.offsetHours = offset;
    $scope.startDate = moment().subtract($scope.offsetHours , 'hours');
    $scope.stopDate = moment();

    $scope.reloadData();

  };
  $scope.reloadData = function() {

    APIservice.getSamples($scope.deviceId, $scope.equipment, $scope.frequency, $scope.startDate, $scope.stopDate).then(function (graphData) {
      $scope.graphData = graphData;
      $scope.lastSamples = [];
      for (var index in graphData) {
        var length = graphData[index]['average'].length;
        $scope.lastSamples[index] = graphData[index]['average'][0][1];
      }
    });

    $timeout(function() {
      $scope.startDate = moment().subtract($scope.offsetHours , 'hours');
      $scope.stopDate = moment();
      $scope.reloadData();
    }, $scope.reloadInterval);

  };

  $scope.reloadData();
});


