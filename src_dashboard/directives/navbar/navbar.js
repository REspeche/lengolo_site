mainApp.directive('navBar', function() {

  return {
      restrict: 'E',
      controller: ['$scope', 'modalSvc', 'authenticationSvc', 'actionSvc', 'mainSvc', '$rootScope', 'BASE_URL', '$window', '$translate',
      function ($scope, modalSvc, authenticationSvc, actionSvc, mainSvc, $rootScope, BASE_URL, $window, $translate) {
        $scope.lstAlerts = [];
        $scope.path = BASE_URL.api + '/v1/common/viewFile?type=profile&file=';
        $rootScope.showRefresh = false;

        $scope.loadTopBar = function() {
          $(document).ready(function() {
            // SideNav Initialization
            $("#slide-out").show();
            $(".button-collapse").sideNav();
          });
        };

        $scope.logout = function() {
          modalSvc.showModal({
                templateUrl: '/templates/modals/modalCloseSession.html',
                size: 'sm'
              },
              {
                defer: false,
                beforeClose: function (scope) {
                  mainSvc.callService({
                      url: 'auth/logout'
                  }).then(function (response) {
                    authenticationSvc.logout();
                    actionSvc.goToExternal(2); // go to login
                  });
                }
              });
        };

        $scope.getListAlerts = function () {
          mainSvc.callService({
              url: 'common/getlistalerts',
              params: {
                'usrId': $rootScope.userInfo.id,
                'limit': 5
              }
          }).then(function (response) {
              $scope.lstAlerts = response;
          });
        };

        $scope.getTime = function(seconds) {
          if (seconds > 60) {
            var minutes = seconds/60;
            if (minutes > 60) {
              var hours = minutes/60;
              if (hours > 24) {
                var days = hours/24;
                return Math.floor(days)+' días';
              }
              else {
                return Math.floor(hours)+' hor';
              }
            }
            else {
              return Math.floor(minutes)+' min';
            }
          }
          else {
            return Math.floor(seconds)+' seg';
          }
        };

        $scope.setViewedAlert = function (item) {
          mainSvc.callService({
              url: 'common/setViewedAlert',
              params: {
                'axuId': item.id
              }
          }).then(function (response) {
              $rootScope.alerts.notifications--;
              actionSvc.goToAction(item.action);
          });
        };

        $scope.viewAllAlerts = function () {
          actionSvc.goToAction(8); //alerts
        };

        $scope.clickContact = function (param) {
          if (param) {
            setUrlQuery('/'+actionSvc.getURL(14)+((param)?'?'+param:''));
          }
          else {
            actionSvc.goToAction(9); //contact
          }
        };

        $scope.clickItemMenu = function(action) {
            actionSvc.goToAction(action);
        };

        $scope.refreshMenu = function() {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_CONFIRM_ACTION')
          }).then(function (result) {
            mainSvc.callService({
                url: 'menu/refreshMenu'
            }).then(function (response) {
                $rootScope.showRefresh = false;
                $rootScope.alerts.isChange = 0;
                mainSvc.showAlertByCode(7);
            });
          });  
        };

        $scope.viewMenuDesktop = function() {
          $window.open(BASE_URL.menu+$rootScope.userInfo.codeMenu+'?print=1', '_blank');
        }

      }],
      templateUrl: 'templates/directives/navbar/navbar.html'
  };
});
