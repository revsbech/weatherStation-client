
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

