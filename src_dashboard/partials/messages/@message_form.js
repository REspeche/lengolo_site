angular.module('mainApp').controller('messageFormController', ['$scope', 'actionSvc', 'modalSvc', 'mainSvc', '$rootScope', '$stateParams', '$translate', '$cookies',
    function ($scope, actionSvc, modalSvc, mainSvc, $rootScope, $stateParams, $translate, $cookies) {
        $scope.paramAction = '';
        $scope.paramId = 0;
        $scope.loadForm = false;
        $scope.formData = {
          title: '',
          message: '',
          enable: 1,
          type: 1
        };
        $scope.lstMessages = [];
        $scope.editForm = false;

        $scope.loadFormMessage = function() {
          $scope.paramAction = $stateParams.action;
          $scope.paramId = $stateParams.id;

          $translate.onReady(function() {
            $scope.msgInvalid = $translate.instant('MSG_INVALID_INPUT');
          });

          /* Load Data */
          if ($scope.paramAction=="edit" && $scope.paramId) {
            mainSvc.callService({
                url: 'message/getmessage',
                params: {
                  'msgId': $scope.paramId
                }
            }).then(function (response) {
              $scope.formData = response[0];
              $scope.loadForm = true;
            });
          }
          else {
            $scope.loadForm = true;
          };
        }

        $scope.clickRemove = function() {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_REMOVE_ACTION', { name: $scope.formData.name})
          }).then(function (result) {
            mainSvc.callService({
                url: 'message/removemessage',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'msgId': $scope.paramId
                }
            }).then(function (response) {
              $rootScope.showRefresh = true;
              actionSvc.goToAction(20); //list messages
              mainSvc.showAlertByCode(4);
            });
          });
        };

        $scope.isEditingForm = function () {
            if (!$scope.editForm) $scope.editForm = true;
        }

        $scope.submitForm = function() {
          if (!$scope.frmMessage.$invalid) {
            $('#frmMessage').removeClass('was-validated');
            //Ajax send
            mainSvc.callService({
                url: ($scope.paramAction=='new')?'message/insertmessage':'message/updatemessage',
                params: Object.assign({}, {
                  'usrId': $rootScope.userInfo.id,
                  'msgId': ($scope.paramAction=='new')?0:$scope.paramId
                }, $scope.formData)
            }).then(function (response) {
              if (response.code==0) {
                $rootScope.showRefresh = true;
                actionSvc.goToAction(20); //list messages
                mainSvc.showAlertByCode(1);
              }
              else {
                mainSvc.showAlertByCode(response[0].code);
              }
            });
          }
          else {
            $('#frmMessage').addClass('was-validated');
            $scope.invalidForm = true;
            mainSvc.showAlertByCode(103);
          }
        }

        $scope.clickCancelForm = function() {
          if ($scope.editForm) {
            modalSvc.showModal({
              size: 'sm'
            },{
              closeButtonText: $translate.instant('BTN_NO'),
              actionButtonText: $translate.instant('BTN_YES'),
              bodyText: $translate.instant('MSG_CANCEL_ACTION')
            }).then(function (result) {
              actionSvc.goToAction(20); //list messages
            });
          }
          else {
            actionSvc.goToAction(20); //list messages
          }
        }

    }]);
