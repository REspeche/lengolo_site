mainApp.directive('badgeStatus',[function () {

    return {
        restrict: 'E',
        scope: {
            id: '@',
            usrtype: '@',
            type: '@'
        },
        controller: ['$scope',
          function ($scope) {

            $scope.$watch('id', function() {
              $scope.color = 'light';
              $scope.label = '';
              $scope.icon = 'cocktail';
              if ($scope.type=='order') {
                switch (parseInt($scope.id)) {
                  case 1:
                    $scope.color = 'danger';
                    $scope.label = 'Pending';
                    $scope.icon = 'clock';
                    break;
                  case 2:
                    $scope.color = 'warning';
                    $scope.label = 'Cooking';
                    $scope.icon = 'utensils';
                    break;
                  case 3:
                    $scope.color = 'info';
                    switch (parseInt($scope.usrtype)) {
                      case 3:
                        $scope.label = 'Delivery';
                        $scope.icon = 'truck';
                        break;
                      case 4:
                        $scope.label = 'Calling';
                        $scope.icon = 'bullhorn';
                        break;
                      default:
                        $scope.label = 'On Way';
                        $scope.icon = 'shoe-prints';
                    };
                    break;
                  case 4:
                    $scope.color = 'success';
                    $scope.label = 'Delivered';
                    $scope.icon = 'thumbs-up';
                    break;
                  case 5:
                    $scope.color = 'dark';
                    $scope.label = 'Canceled';
                    $scope.icon = 'thumbs-down';
                    break;
                }
              }
            });
        }],
        template: '<span class="badge badge-pill badge-{{color}} py-1 px-2">{{label}}<i class="fas fa-{{icon}}"></i></span>'
    };
}]);
