angular.module('mainApp').controller('membersController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', '$translate', 'modalSvc', 'BASE_URL', '$q', 'authenticationSvc', '$cookies',
    function ($scope, mainSvc, actionSvc, $rootScope, $translate, modalSvc, BASE_URL, $q, authenticationSvc, $cookies) {

        $scope.members = [];
        $scope.countRequest = [];
        $scope.loadList = false;
        $scope.path = BASE_URL.api + '/v1/common/viewFile?type=profile&file=';
        $scope.pathMenu = BASE_URL.menu;

        $scope.loadMembers = function() {
          mainSvc.callService({
              url: 'profile/getMembers',
              params: {
                'usrId'   : $rootScope.userInfo.id
              }
          }).then(function (response) {
            $scope.members = angular.copy(response);
            $scope.loadList = true;
          });
        }

        $scope.cleanAllCache = function() {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_CONFIRM_ACTION')
          }).then(function (result) {
            mainSvc.callService({
              url: 'menu/cleanAllCache'
            }).then(function (response) {
              mainSvc.showAlertByCode(1);
            });
          });
        }

        $scope.refreshCache = function(item) {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_CONFIRM_ACTION')
          }).then(function (result) {
            mainSvc.callService({
              url: 'menu/refreshMenu',
              params: {
                'usrId': item.id
              }
            }).then(function (response) {
              mainSvc.showAlertByCode(1);
            });
          });
        }

        $scope.clickNew = function () {
          actionSvc.goToAction(16.1, {id: 0, action: 'new'}); //new member
        }

        $scope.clickEdit = function(item) {
          actionSvc.goToAction(16.1, {id: item.id, action: 'edit'}); //edit member
        }

        $scope.clickRemove = function(item) {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_REMOVE_ACTION', { name: item.name})
          }).then(function (result) {
            mainSvc.callService({
                url: 'profile/removeMember',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'memId': item.id
                }
            }).then(function (response) {
              mainSvc.callService({
                url: 'menu/refreshMenu',
                params: {
                  'usrId': item.id
                }
              }).then(function (response) {
                let index = $scope.members.findIndex( record => record.id == item.id );
                $scope.members.splice(index, 1);
                mainSvc.showAlertByCode(4);
              });
            });
          });
        }

        $scope.clickResetPass = function(item) {
          modalSvc.showModal({
            templateUrl: '/templates/modals/modalNewPass.html'
          },
          {
              closeButtonText: undefined,
              formDataPass: {
                passAdmin: '',
                newPass: ''
              },
              defer: true,
              beforeClose: function (scope) {
                var defered = $q.defer();
                var promise = defered.promise;

                if (!scope.frmPass.$invalid) {
                  $('#frmPass').removeClass('was-validated');
                  mainSvc.callService({
                      url: 'profile/resetPass',
                      params: {
                        'usrId': $rootScope.userInfo.id,
                        'memId': item.id,
                        'passAdmin': scope.modalOptions.formDataPass.passAdmin,
                        'newPass': scope.modalOptions.formDataPass.newPass
                      }
                  }).then(function (response) {
                    if (response.code==0) {
                      mainSvc.showAlertByCode(1);
                      defered.resolve(true);
                    }
                    else {
                      mainSvc.showAlertByCode(response.code);
                      defered.resolve(false);
                    }
                  });
                }
                else {
                  $('#frmPass').addClass('was-validated');
                  scope.invalidForm = true;
                  mainSvc.showAlertByCode(103);
                  defered.resolve(false);
                };
                return promise;
              }
          });
        }

        $scope.clickLogin = function(item) {
          //Validations
          mainSvc.callService({
              url: 'auth/loginFast',
              params: {
                'usrId': item.id
              },
              secured: false
          }).then(function (response) {
            if (response.token) {
              authenticationSvc.saveLogin({
                id              : response.id,
                email           : response.email,
                token           : response.token,
                type            : response.type,
                name            : response.name,
                forceProfile    : response.forceProfile,
                role            : response.role,
                rememberLogin   : false,
                avatar          : response.avatar,
                codeMenu        : response.codeMenu,
                canDelivery     : response.canDelivery,
                multipleQR      : response.multipleQR,
                covid19         : response.covid19,
                trial           : response.trial
              });
              if (authenticationSvc.login().isLogin) {
                //remove cache
                $cookies.remove("LENGOLO_MENU_LST");
                $cookies.remove("LENGOLO_CATEGORY_LST");
                $cookies.remove("LENGOLO_MENU");
                $cookies.remove("LENGOLO_CATEGORY");
                localStorage.removeItem("categories_lstBreadcrumbs");
                actionSvc.goToExternal(1); //home
              }
            }
          });
        };

    }]);
