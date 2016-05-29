'use strict';

WeatherApp.controller("View1Controller", function($scope, APIservice, $timeout) {
  $scope.deviceId = "jer-greenhouse01";
  $scope.reloadInterval = 60000;



  $scope.reloadData = function() {
    var startTime = moment().subtract(24 , 'hours');
    var endTime = moment();
    $scope.frequency = "minute";
    $scope.startDate = startTime;
    $scope.stopDate = endTime;

    APIservice.getSamples($scope.deviceId, $scope.equipment, $scope.frequency, $scope.startDate, $scope.stopDate).then(function (graphData) {
      $scope.graphData = graphData;
      $scope.lastSamples = [];
      for (var index in graphData) {
        var length = graphData[index]['average'].length;
        $scope.lastSamples[index] = graphData[index]['average'][0][1];
      }
    });

    $timeout(function() {
      $scope.reloadData()
    }, $scope.reloadInterval);

  };

  $scope.reloadData();
});


