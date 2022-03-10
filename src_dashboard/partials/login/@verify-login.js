angular.module('mainApp').controller('verifyLoginController', ['$rootScope', '$scope', 'authenticationSvc', 'mainSvc', 'alertSvc', 'modalSvc', 'actionSvc',
    function ($rootScope, $scope, authenticationSvc, mainSvc, alertSvc, modalSvc, actionSvc) {
      $scope.loadVerifyLogin = function() {
        if(authenticationSvc.getUserInfo().isLogin) {
          actionSvc.goToAction(1); //go to home
        }
        else {
          if (authenticationSvc.verifyLogin()) {
            //autentificarse
            if (authenticationSvc.login(true).isLogin) {
              //llama al servicio de alertas
              alertSvc.getAlerts().then(function (alerts) {
                actionSvc.goToAction(1); //go to home
              });
            }
          }
          else {
            actionSvc.goToAction(2); // go to login
          }
        }
      }
    }]);
