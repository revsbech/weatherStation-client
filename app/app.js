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

'use strict';

angular.module('WeatherApp.version.interpolate-filter', [])

.filter('interpolate', ['version', function(version) {
  return function(text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  };
}]);

'use strict';

angular.module('WeatherApp.version.version-directive', [])

.directive('appVersion', ['version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
}]);

'use strict';

angular.module('WeatherApp.version', [
  'WeatherApp.version.interpolate-filter',
  'WeatherApp.version.version-directive'
])

.value('version', '0.1');

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
'use strict';

WeatherApp.controller("View2Controller", function($scope) {

});

function DeviceHiveApi(options) {
  if (!options.baseUrl) {
      throw 'DeviceHiveApi: "baseUrl" not defined in options';
  }

  if (!options.request) {
      throw 'DeviceHiveApi: "request" not defined in options';
  }

  this.get = function(request) {
      request.method =  'GET';
      request.url = options.baseUrl + request.url;
      request.headers = {'Content-Type': 'application/json'};
      return options.request(request);
  }

  /**
   * Return an object with twokeys average and highlow ready for rendering
   * @param deviceId
   * @param equipmentId
   * @param frequency
   * @param start
   * @param end
   */
  this.getSamples = function(deviceId, equipmentId, frequency, start, end) {
      return this.get({
          url: 'device/' + deviceId + '/sample',
          params: {equipment: equipmentId, frequency: frequency, start: start, end: end},

          parse: function(returnData) {
            var equipmentSamples = [];
            for(var index in returnData) {
              var time = moment.utc(returnData[index]['datetime']);
              var equipment = returnData[index]['equipment'];
              if (equipmentSamples[equipment] == undefined) {
                equipmentSamples[equipment] = {
                  highlow: [],
                  average: []
                }
              }
              equipmentSamples[equipment].highlow.push([time.format('x'), returnData[index]['high'], returnData[index]['low']]);
              equipmentSamples[equipment].average.push([time.format('x'), returnData[index]['average']]);
            }
            return equipmentSamples;
          }
      });
  }
}
/**
 * This directive expects the date, equipment and frequency to be in scope!
 *
 * - Device must be a devicemodel with an id attribute
 * - Equipment must be an equipment model with a code attribute
 * - Date must be and object containting minDate and maxDate as moment objects
 * - frequency must be a string "minute", "hour" or "day"
 *
 */
WeatherApp.directive('graph', function (APIservice, $window) {
  return {
    restrict: 'E',
    scope: {
      "equipment": '@',
      "labels": '@',
      "graphData": '='
    },
    link: function (scope, elem, attrs) {
      var equipmentArray = scope.equipment.split(',');
      var labelArray = scope.labels.split(',');
      var colorArray = ['#3a87ad','#009688'];
      var chart = null;
      var options = {
        xaxis: {
          mode: 'time',
          timezone: 'browser'
        },
        yaxes: [{
          position: 'right',
          labelWidth: 50
        }],
        legend: {show: true},
        grid: {
          hoverable: true,
          clickable: true,
          autoHighlight: true,
          color: '#404041',
          borderColor: '#404041'
        },
        tooltip: true,
        tooltipOpts: {
          content: '<div class="popover-content"><small><strong>%y</strong> - %x</small></div>',
          xDateFormat: '%Y/%m/%d %H:%M:%S',
          defaultTheme: false,
          onHover: function (item, toolTip) {
            // No tooltips for highlow
            if (item.series.id.lastIndexOf("highlow-", 0) === 0) {
              $(toolTip).hide();
              return;
            }

            $(toolTip).addClass('popover');
          }
        }
      };

      // When data is ready, render chart
      var chart = null;
      scope.$watch('graphData', function() {

        if (scope.graphData != undefined) {
          var dataset = [];

          for (var index in equipmentArray) {
            var equipment = equipmentArray[index];

            dataset.push({
              id: equipment,
              label: labelArray[index],
              color: colorArray[index],
              lines: {
                lineWidth: 1.5,
                show: true
              },
              data: scope.graphData[equipment].average
            });
          }

          if (chart) {
            chart.setData(dataset);
            chart.setupGrid();
            chart.draw();
            return;
          }
          chart = $.plot(elem, dataset, options);

          // Listen to window resize event
          // then re-draw the graphs
          angular.element($window).on('resize', function () {
             chart.resize();
             chart.setupGrid();
             chart.draw();
          });
        }
      });


      // Cleanup the chart when it goes out of scope
      // https://groups.google.com/forum/#!topic/angular/5rNNI8ONhYQ
      scope.$on('$destroy', function () {
        if (!chart) {
          return
        }

        chart.shutdown();
      });
    }
  }

});


function AuthenticationError(message) {
    this.message = (message || "");
}
AuthenticationError.prototype = new Error();

WeatherApp.factory('APIservice', function ($q, $http) {
  var deviceHiveBaseUrl = 'http://hive.moc.net:3000/';
  var deviceHiveToken = '123';
  var deviceHiveApi = new DeviceHiveApi({
      baseUrl: deviceHiveBaseUrl,
      request: function(request) {
          var deferred = $q.defer();
          var canceler = $q.defer();
          request.cache = false;
          request.headers['Authorization'] = "Bearer " + deviceHiveToken;
          //http://docs.angularjs.org/api/ng.$http#methods_get
          $http(request)
              .success(function(data, status, headers, config) {
                  if (request.parse) {
                      deferred.resolve(request.parse(data));
                      return;
                  }
                  deferred.resolve(data);
              })
              .error(function(data, status, headers, config) {
                  deferred.reject(status);
                  if (status == 401) {
                      throw new AuthenticationError('Could not query the api');
                  }
              })
          ;

          return deferred.promise;
      }
  });

  var serviceAPI = {
    getSamples: function (deviceId, equipmentId, frequency, startTime, endTime) {
      return deviceHiveApi.getSamples(deviceId, equipmentId, frequency, startTime.format(), endTime.format());
    }
  };

  return serviceAPI;
});

