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