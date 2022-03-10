angular.module('mainApp').controller('alertController', ['$scope', 'mainSvc', '$rootScope', 'actionSvc',
    function ($scope, mainSvc, $rootScope, actionSvc) {
      $scope.alerts = [];
      $scope.loadList = false;

      $scope.loadAlert = function() {
        mainSvc.callService({
            url: 'common/getlistalerts',
            params: {
              'usrId': $rootScope.userInfo.id,
              'limit': -1
            }
        }).then(function (response) {
            $scope.alerts = response;
            $scope.loadList = true;
        });
      }

      $scope.setViewedAlert = function (item) {
        mainSvc.callService({
            url: 'common/setViewedAlert',
            params: {
              'axuId': item.id
            }
        }).then(function (response) {
            let index = $scope.alerts.findIndex( record => record.id == item.id );
            $scope.alerts[index].viewed = 1;
            $rootScope.alerts.notifications--;
        });
      };

      $scope.goToActionAlert = function (item) {
        $scope.setViewedAlert(item);
        actionSvc.goToAction(item.action);
      }
    }]);
