angular.module('mainApp').controller('loginController', ['$scope', 'authenticationSvc', 'mainSvc', '$cookies', 'actionSvc', 'modalSvc', '$translate',
    function ($scope, authenticationSvc, mainSvc, $cookies, actionSvc, modalSvc, $translate) {
      $scope.formData = {
        email: '',
        password: '',
        remember: false
      };
      $scope.showValidateMsg = false;

      $scope.loadLogin = function () {
        $scope.querystring = {
          urlback: getQueryStringValue('urlback'),
          email: getQueryStringValue('email'),
          endSession: getQueryStringValue('endSession'),
          endToken: getQueryStringValue('endToken')
        };

        if (authenticationSvc.verifyLogin()) {
          if (authenticationSvc.login().isLogin) {
            actionSvc.goToExternal(1); //go to home
          }
        }
        else {
          //load email
          if ($scope.querystring.email != "") {
              $scope.formData.email = $scope.querystring.email;
          }

          //load popup end session
          if ($scope.querystring.endSession == '1' || $scope.querystring.endToken == '1') {
            $translate.onReady(function() {
              setHash('/login');
              modalSvc.showModal({
                size: 'lg'
              },{
                closeButtonText: $translate.instant('BTN_CLOSE'),
                actionButtonText: undefined,
                bodyText: ($scope.querystring.endSession=='1')?$translate.instant('MSG_END_SESSION'):$translate.instant('MSG_FAIL_TOKEN')
              });
            });
          }
        }
      };

      $scope.login = function() {
        //Validations
        if (!$scope.formData.email || !$scope.formData.password) {
          mainSvc.showAlertByCode(100);
          return false;
        }
        mainSvc.callService({
            url: 'auth/login',
            params: {
               'email': $scope.formData.email,
               'password': $scope.formData.password
            },
            secured: false
        }).then(function (response) {
          if (response.code==200) {
            $scope.formData.password = "";
          }
          else if (response.code==207) {
            $scope.showValidateMsg = true;
          }
          else {
            if (response.token) {
              if (response.trial==3) {
                // version trial finished
                mainSvc.showAlertByCode(317);
                return false;
              }
              authenticationSvc.saveLogin({
                id              : response.id,
                email           : response.email,
                token           : response.token,
                type            : response.type,
                name            : response.name,
                forceProfile    : response.forceProfile,
                role            : response.role,
                rememberLogin   : $scope.formData.remember,
                avatar          : response.avatar,
                codeMenu        : response.codeMenu,
                canDelivery     : response.canDelivery,
                multipleQR      : response.multipleQR,
                covid19         : response.covid19,
                trial           : response.trial,
                isDebtor        : response.isDebtor,
                multiLanguage   : response.multiLanguage
              });
              if (authenticationSvc.login().isLogin) {
                //remove cache
                $cookies.remove("LENGOLO_MENU_LST");
                $cookies.remove("LENGOLO_CATEGORY_LST");
                $cookies.remove("LENGOLO_MENU");
                $cookies.remove("LENGOLO_CATEGORY");
                localStorage.removeItem("categories_lstBreadcrumbs");

                if (response.forceProfile) actionSvc.goToExternal(6); //profile
                else actionSvc.goToExternal(1); //home
              }
            }
          }
        });
      }

      $scope.signUp = function() {
        actionSvc.goToAction(4); // go to signup
      }

      $scope.forgot = function() {
        actionSvc.goToAction(5); // go to forgot
      }

      $scope.sendMailValidate = function() {
        if (!$scope.formData.email || !$scope.formData.password) {
          mainSvc.showAlertByCode(104);
          return false;
        }
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.formData.email)) {
          mainSvc.showAlertByCode(204);
          return false;
        }
        mainSvc.callService({
            url: 'auth/validateagain',
            params: {
              'email': $scope.formData.email,
              'password': $scope.formData.password
            },
            secured: false
        }).then(function (response) {
          $scope.showValidateMsg = false;
          mainSvc.showAlertByCode(102);
        });
      }
    }]);
