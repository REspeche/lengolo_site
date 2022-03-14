angular.module('mainApp').controller('panelController', ['$scope', 'mainSvc', 'actionSvc', 'modalSvc', '$translate', '$rootScope',
    function ($scope, mainSvc, actionSvc, modalSvc, $translate, $rootScope) {
        $scope.lstCounters = [{
          'categories': 0,
          'products': 0,
          'pendingOrders': 0
        }];

        $scope.loadPanel = function() {
          if ($rootScope.userInfo.isDebtor==1) {
            let nowDate = new Date();
            modalSvc.showModal({
                templateUrl: '/templates/modals/modalExpireSystem.html',
                size: 'sm'
              },
              {
                  closeButtonText: undefined,
                  defer: false,
                  params: {
                    month: String(nowDate.getMonth() + 1).padStart(2, '0'),
                    year: nowDate.getFullYear()
                  }
              }
            );
          };

          /* Load general panel */
          mainSvc.callService({
              url: 'home/getAllInfo'
          }).then(function (response) {
            $scope.lstCounters = angular.copy(response.lstCounters);
          });

        };

        $scope.clickItemHome = function(action, param) {
            setUrlQuery('/'+actionSvc.getURL(action)+((param)?'?'+param:''));
        };

        $scope.openModalSubscribe = function(item) {
          modalSvc.showModal({
              templateUrl: '/templates/modals/modalSubscribe.html',
              size: 'lg'
            },
            {
                closeButtonText: undefined,
                defer: false
            });
        }

    }]);
