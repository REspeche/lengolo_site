angular.module('psi.sortable', [])
  .value('psiSortableConfig', {
    placeholder: "placeholder",
    opacity: 0.8,
    axis: "y",
    helper: 'clone',
    forcePlaceholderSize: true,
    handle: '.icon-drag'
  })
  .directive("psiSortable", ['psiSortableConfig', '$log', function(psiSortableConfig, $log) {
    return {
      require: '?ngModel',
      scope: {
        change: '&'
      },
      link: function(scope, element, attrs, ngModel) {

        if(!ngModel) {
          $log.error('psiSortable needs a ng-model attribute!', element);
          return;
        }

        var opts = {};
        angular.extend(opts, psiSortableConfig);
        opts.update = updateEvent;
        opts.start = startEvent;

        // listen for changes on psiSortable attribute
        scope.$watch(attrs.psiSortable, function(newVal) {
          angular.forEach(newVal, function(value, key) {
            element.sortable('option', key, value);
          });
        }, true);

        // store the sortable index
        scope.$watch(attrs.ngModel+'.length', function() {
          element.children('.row-drag').each(function(i, elem) {
            jQuery(elem).attr('sortable-index', i);
          });
        });

        // jQuery sortable update callback
        function startEvent(event, ui) {
          ui.item.startPos = ui.item.index();
        };

        function updateEvent(event, ui) {
          var start_pos = ui.item.startPos;
          var end_pos = ui.item.index();
          var idx = ui.item.data('pos');

          // get model
          var model = ngModel.$modelValue;
          model[idx].action=1; //move
          model[idx].jumpPosition = (end_pos-start_pos);

          // notify angular of the change
          scope.$apply();

          if (scope.change) scope.change();
        };

        element.sortable(opts);
      }
    };
  }]);