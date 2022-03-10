mainApp.directive('manyPrices', function() {
    return {
        restrict: 'E',
        scope: { 
            value: '@' 
        },
        controller: ['$scope',
            function ($scope) {
                $scope.retValue = $scope.value.split('|');

                $scope.formatPrice = function(_val) {
                    if (isNaN(_val)) return _val;
                    else {
                        if (_val<0) _val*=-1;
                        return _val;
                    };
                };
            }],
        template: '<span ng-repeat="val in retValue track by $index" class="tab-space" ng-class="{\'sign\':val!=\'-\'}">{{formatPrice(val)}}</span>'
    };
  });