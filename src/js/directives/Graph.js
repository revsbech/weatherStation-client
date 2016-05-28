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
      "deviceId": '@',
      "frequency": '@',
      startDate: '=',
      stopDate: '='
    },
    link: function (scope, elem, attrs) {

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
  /*
      if (elem.width() == 0 || elem.height() == 0) {
        return;
      }
      */
      scope.$watch('[graphDates, frequency, timezone]', function() {
        var startTime = moment().subtract(24 * 60 , 'minutes');
        var endTime = moment();
        APIservice.getSamples(scope.deviceId, scope.equipment, scope.frequency, scope.startDate, scope.stopDate).then(function (graphData) {


          var dataset = [
            {
              id: 'highlow',
              color: "rgba(217, 237, 247, 1.0)",
              lines: {
                show: true,
                fill: true,
                lineWidth: 0,
                fillColor: "rgba(207, 227, 247, 0.7)"
              },
              highlightColor: "rgba(0, 0, 0, 0.0)",
              data: graphData.highlow,
            },
            {
              id: 'average',
              label: 'Average',
              color: "#3a87ad",
              lines: {
                lineWidth: 1.5,
                show: true
              },
              data: graphData.average
            }
          ];

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

        });
      }, true);



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
