angular.module('mainApp').controller('signUpController', ['$scope', 'actionSvc', 'mainSvc', 'authenticationSvc', 'alertSvc', '$location', 'BASE_URL', '$translate',
    function ($scope, actionSvc, mainSvc, authenticationSvc, alertSvc, $location, BASE_URL, $translate) {
      $scope.formData = {
        type: 0,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordR: '',
        agree: false
      };
      $scope.blockEmail = false;
      $scope.loadForm = false;
      $scope.lstCountry = [];
      $scope.lstCompanies = [];

      $scope.loadSignUp = function() {

        if (authenticationSvc.verifyLogin()) {
          if (authenticationSvc.login().isLogin) {
            actionSvc.goToExternal(1); //go to home
          }
        }
        else {
          $scope.formData.type = getQueryStringValue('type',0);

          if  (getQueryStringValue('email',undefined)!=undefined) {
            $scope.blockEmail = true;
            $scope.formData.email = getQueryStringValue('email','');
          }
          $scope.loadForm = true;
        }
      }

      $scope.signUp = function() {
        //Validations
        if ($scope.formData.firstName=='' ||
            $scope.formData.lastName=='' ||
            $scope.formData.email=='' ||
            $scope.formData.password=='' ||
            $scope.formData.passwordR=='') {
          mainSvc.showAlertByCode(101);
          return false;
        }
        if ($scope.formData.password != $scope.formData.passwordR) {
          mainSvc.showAlertByCode(201);
          return false;
        }
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.formData.email)) {
          mainSvc.showAlertByCode(204);
          return false;
        }
        //Ajax send
        mainSvc.callService({
            url: 'auth/signup',
            params: {
              'firstName': $scope.formData.firstName,
              'lastName': $scope.formData.lastName,
              'email': $scope.formData.email,
              'password': $scope.formData.password,
              'type': $scope.formData.type
            },
            secured: false
        }).then(function (response) {
          if (response.code==0) {
            mainSvc.showAlertByCode(102);
            actionSvc.goToAction(2); //login
          }
          else {
            mainSvc.showAlertByCode(response.code);
          }
        });
      };

      $scope.login = function() {
        actionSvc.goToAction(2); // go to login
      };

      $scope.selectType = function(type) {
        $scope.formData.type = type;
        if (type==0) setQuery({});
        else {
          setQuery({type: type});
        };
      };

    }]);
