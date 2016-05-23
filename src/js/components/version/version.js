'use strict';

angular.module('WeatherApp.version', [
  'WeatherApp.version.interpolate-filter',
  'WeatherApp.version.version-directive'
])

.value('version', '0.1');
