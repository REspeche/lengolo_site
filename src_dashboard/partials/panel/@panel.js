angular.module('mainApp').controller('panelController', ['$scope', 'mainSvc', 'actionSvc', 'modalSvc', '$translate', '$rootScope', 'CONSTANTS',
    function ($scope, mainSvc, actionSvc, modalSvc, $translate, $rootScope, CONSTANTS) {
        $scope.lstCounters = [{
          'categories': 0,
          'products': 0,
          'pendingOrders': 0
        }];
        var dateExpire = DateTimeToDateObj(CONSTANTS.dateExpire);

        $scope.loadPanel = function() {
          var diff = new Date(dateExpire.getTime() - new Date().getTime());
          var daysToExpire = diff.getUTCDate() - 1;

          if ($rootScope.userInfo.isDebtor==1 && daysToExpire<=15) {
            let nowDate = new Date();
            modalSvc.showModal({
                templateUrl: '/templates/modals/modalExpireSystem.html',
                size: 'sm'
              },
              {
                  closeButtonText: undefined,
                  defer: false,
                  params: {
                    month: String(nowDate.getMonth() + 2).padStart(2, '0'),
                    year: nowDate.getFullYear(),
                    textDays: (daysToExpire>0)?'dentro de '+daysToExpire+' días vencerá':((daysToExpire==0)?'hoy vence':'hace '+(daysToExpire*-1)+' días vencío'),
                    classPopup: (daysToExpire>0)?'warning':'danger'
                  }
              }
            );
          };
          if ($rootScope.userInfo.isDebtor==1 && daysToExpire<-10) {
            let nowDate = new Date();
            modalSvc.showModal({
                templateUrl: '/templates/modals/modalExpiredSystem.html',
                size: 'sm'
              },
              {
                  closeButtonText: undefined,
                  defer: false
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
