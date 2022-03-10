angular.module('mainApp').controller('forgotController', ['$scope', 'actionSvc', 'mainSvc', 'authenticationSvc',
    function ($scope, actionSvc, mainSvc, authenticationSvc) {
      $scope.formData = {
        email: ''
      };

      $scope.loadForgot = function() {
        if (authenticationSvc.verifyLogin()) {
          if (authenticationSvc.login().isLogin) {
            actionSvc.goToExternal(1); //go to home
          }
        }
      }

      $scope.forgot = function() {
        //Validations
        if (!$scope.formData.email) {
          mainSvc.showAlertByCode(101);
          return false;
        }
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.formData.email)) {
          mainSvc.showAlertByCode(204);
          return false;
        }
        mainSvc.callService({
            url: 'auth/forgot',
            params: {
               'email': $scope.formData.email
            },
            secured: false
        }).then(function (response) {
          mainSvc.showAlertByCode(102);
          actionSvc.goToAction(2); // go to login
        });
      }

      $scope.login = function() {
        actionSvc.goToAction(2); // go to login
      }
    }]);
