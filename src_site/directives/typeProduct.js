mainApp.directive('typeProduct',['$translate', function ($translate) {

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
                $scope.tooltip = $translate.instant('BUD_VEGETARIAN');
                $scope.label = $translate.instant('LBL_TYPE_VEGETARIAN');
                break;
              case 3:
                $scope.class = 'spicy';
                $scope.tooltip = $translate.instant('BUD_SPICY');
                $scope.label = $translate.instant('LBL_TYPE_SPICY');
                break;
              case 4:
                $scope.class = 'notacc';
                $scope.tooltip = $translate.instant('BUD_WITHOUT_TACC');
                $scope.label = $translate.instant('LBL_TYPE_TACC');
                break;
            };
        }],
        template: '<div class="note {{class}}" data-toggle="tooltip" data-placement="right" title="{{tooltip}}">{{label}}</div>'
    };
}]);
