mainApp.directive('badgeStatus', function() {

        return {
            restrict: 'E',
            scope: {
                id: '@',
                type: '@'
            },
            controller: ['$scope', '$translate', '$rootScope',
              function ($scope, $translate, $rootScope) {

                $scope.$watchGroup(['$rootScope.lang', 'id'], function(newValues, oldValues, scope) {
                  $scope.color = 'light';
                  $scope.label = '';
                  if ($scope.type=='shipping') {
                    switch (parseInt($scope.id)) {
                      case 1:
                        $scope.color = 'danger';
                        $scope.label = $translate.instant('BUD_PENDING');
                        break;
                      case 2:
                        $scope.color = 'primary';
                        $scope.label = $translate.instant('BUD_PAYED');
                        break;
                      case 3:
                        $scope.color = 'warning';
                        $scope.label = $translate.instant('BUD_SENT');
                        break;
                      case 4:
                        $scope.color = 'success';
                        $scope.label = $translate.instant('BUD_READY');
                        break;
                    }
                  }
                  else if ($scope.type=='order') {
                    switch (parseInt($scope.id)) {
                      case 1:
                        $scope.color = 'danger';
                        $scope.label = $translate.instant('BUD_PENDING');
                        break;
                      case 2:
                        $scope.color = 'warning';
                        $scope.label = $translate.instant('BUD_PROCESSING');
                        break;
                      case 3:
                        $scope.color = 'info';
                        $scope.label = $translate.instant('BUD_DELIVERY');
                        break;
                      case 4:
                        $scope.color = 'success';
                        $scope.label = $translate.instant('BUD_READY');
                        break;
                      case 5:
                        $scope.color = 'dark';
                        $scope.label = $translate.instant('BUD_CANCELED');
                        break;
                    }
                  }
                  else if ($scope.type=='type') {
                    switch (parseInt($scope.id)) {
                      case 1:
                        $scope.color = 'danger';
                        $scope.label = $translate.instant('BUD_DANGER');
                        break;
                      case 2:
                        $scope.color = 'warning';
                        $scope.label = $translate.instant('BUD_WARNING');
                        break;
                      case 3:
                        $scope.color = 'info';
                        $scope.label = $translate.instant('BUD_INFO');
                        break;
                    }
                  }
                }, true);
            }],
            template: '<span class="badge badge-pill badge-{{color}} py-1 px-2">{{label}}</span>'
        };
    });
