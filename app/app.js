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

WeatherApp.controller("View1Controller", function($scope) {

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
            var samples = {
              highlow: [],
              average: []
            };

            for(var index in returnData) {
              var time = moment.utc(returnData[index]['datetime']);
              samples.highlow.push([time.format('x'), returnData[index]['high'], returnData[index]['low']]);
              samples.average.push([time.format('x'), returnData[index]['average']]);
            }
            return samples;
          }
      });
  }
}

function AuthenticationError(message) {
    this.message = (message || "");
}
AuthenticationError.prototype = new Error();

WeatherApp.factory('APIservice', function ($q, $http, $auth) {
  var deviceHiveBaseUrl = 'http://hive.moc.net:3000/';

  var deviceHiveApi = new DeviceHiveApi({
      baseUrl: deviceHiveBaseUrl,
      request: function(request) {
          var deferred = $q.defer();
          var canceler = $q.defer();
          request.cache = false;
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

