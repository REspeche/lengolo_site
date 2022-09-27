angular.module('mainApp').controller('menuFormController', ['$scope', 'actionSvc', 'modalSvc', 'mainSvc', '$rootScope', '$stateParams', '$translate', '$cookies', 'BASE_URL',
    function ($scope, actionSvc, modalSvc, mainSvc, $rootScope, $stateParams, $translate, $cookies, BASE_URL) {
        $scope.paramAction = '';
        $scope.paramId = 0;
        $scope.loadForm = false;
        $scope.formData = {
          name: '',
          enable: 1,
          timeS: 0,
          timeE: 1439,
          days: [1,1,1,1,1,1,1],
          canDelivery: 0,
          ownStyle: 0,
          rate: 1,
          formCovid19: 0
        };
        $scope.codeStyle = '';
        $scope.editForm = false;
        $scope.path = changeProtocolSSL(BASE_URL.api) + '/v1/common/viewFile?type=css&file=';

        $scope.loadFormMenu = function() {
          $scope.paramAction = $stateParams.action;
          $scope.paramId = $stateParams.id;

          $translate.onReady(function() {
            $scope.msgInvalid = $translate.instant('MSG_INVALID_INPUT');
          });

          /* Load Data */
          if ($scope.paramAction=="edit" && $scope.paramId) {
            mainSvc.callService({
                url: 'menu/getmenu',
                params: {
                  'menId': $scope.paramId
                }
            }).then(function (response) {
              $scope.formData = response[0];
              $scope.formData.canDelivery = ($scope.formData.canDelivery==1)?true:false;
              $scope.formData.ownStyle = ($scope.formData.ownStyle==1)?true:false;
              $scope.formData.formCovid19 = ($scope.formData.formCovid19==1)?true:false;
              $scope.loadCss();
              $scope.formData.days = [];
              for(i = 0; i < $scope.formData.daysBinary.length; i++) {
                $scope.formData.days.push(($scope.formData.daysBinary.substring(i,i+1)=='1')?1:0);
              }
              $scope.loadForm = true;
              initRangeTime($scope.formData.timeS, $scope.formData.timeE, 'menuFormController');
            });
          }
          else {
            $scope.loadForm = true;
            initRangeTime($scope.formData.timeS, $scope.formData.timeE, 'menuFormController');
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
                url: 'menu/removemenu',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'menId': $scope.paramId
                }
            }).then(function (response) {
              $rootScope.showRefresh = true;
              $cookies.remove("LENGOLO_MENU_LST");
              actionSvc.goToAction(12); //list menus
              mainSvc.showAlertByCode(4);
            });
          });
        };

        $scope.isEditingForm = function () {
            if (!$scope.editForm) $scope.editForm = true;
        }

        $scope.submitForm = function() {
          if (!$scope.frmMenu.$invalid) {
            $('#frmMenu').removeClass('was-validated');
            //Ajax send
            mainSvc.callService({
                url: ($scope.paramAction=='new')?'menu/insertmenu':'menu/updatemenu',
                params: Object.assign({}, {
                  'usrId': $rootScope.userInfo.id,
                  'menId': ($scope.paramAction=='new')?0:$scope.paramId,
                  'codeStyle': $scope.codeStyle,
                  'codeMenu': $rootScope.userInfo.codeMenu,
                  'formCovid19': $scope.formData.formCovid19
                }, $scope.formData)
            }).then(function (response) {
              if (response.code==0) {
                $rootScope.showRefresh = true;
                $cookies.remove("LENGOLO_MENU_LST");
                actionSvc.goToAction(12); //list menus
                mainSvc.showAlertByCode(1);
              }
              else {
                mainSvc.showAlertByCode(response[0].code);
              }
            });
          }
          else {
            $('#frmMenu').addClass('was-validated');
            $scope.invalidForm = true;
            mainSvc.showAlertByCode(103);
          }
        };

        $scope.clickCancelForm = function() {
          if ($scope.editForm) {
            modalSvc.showModal({
              size: 'sm'
            },{
              closeButtonText: $translate.instant('BTN_NO'),
              actionButtonText: $translate.instant('BTN_YES'),
              bodyText: $translate.instant('MSG_CANCEL_ACTION')
            }).then(function (result) {
              actionSvc.goToAction(12); //list menus
            });
          }
          else {
            actionSvc.goToAction(12); //list menus
          }
        };

        $scope.loadCss = function() {
          if ($scope.formData.ownStyle) {
            let fileCss = $scope.path + $rootScope.userInfo.codeMenu + '_' + $scope.paramId + '.css';
            $.when($.get(fileCss))
            .done(function(contentFile) {
                $scope.codeStyle = contentFile;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                $scope.codeStyle = "";
            });
          }
        };

        $scope.changeCustomStyle = function() {
          $scope.loadCss();
          $scope.isEditingForm();
        };

        $scope.defineStyle = function() {
          modalSvc.showModal({
            templateUrl: '/templates/modals/modalCustomStyle.html',
            size: 'lg'
          },
          {
            formData: {
              code: $scope.codeStyle
            },
            defer: false,
            beforeClose: function (scope) {
              $scope.codeStyle = scope.modalOptions.formData.code;
              $scope.isEditingForm();
              return true;
            }
          });
        }

  }]);
