mainApp.directive('typeProduct', function() {

    return {
        restrict: 'E',
        scope: {
            type: '@'
        },
        controller: ['$scope',
          function ($scope) {
            $scope.class = '';
            $scope.tooltip = '';
            $scope.label = '';
            switch (parseInt($scope.type)) {
              case 2:
                $scope.class = 'veggie';
                $scope.tooltip = 'Vegetariano';
                $scope.label = 'v';
                break;
              case 3:
                $scope.class = 'spicy';
                $scope.tooltip = 'Picante';
                $scope.label = 's';
                break;
              case 4:
                $scope.class = 'notacc';
                $scope.tooltip = 'sin TACC';
                $scope.label = 't';
                break;
            };
        }],
        template: '<div class="note {{class}}" data-toggle="tooltip" data-placement="right" title="{{tooltip}}">{{label}}</div>'
    };
});
