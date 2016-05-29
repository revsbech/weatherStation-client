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
