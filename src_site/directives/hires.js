mainApp.directive('hires', function() {
    return {
      restrict: 'A',
      scope: { hires: '@' },
      link: function(scope, element, attrs) {
          element.one('load', function() {
              element.attr('src', scope.hires);
          });
      }
    };
  });