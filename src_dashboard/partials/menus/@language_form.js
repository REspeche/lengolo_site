angular.module('mainApp').controller('languageFormController', ['$rootScope', '$scope', 'mainSvc', 'actionSvc', 'modalSvc', '$translate', '$stateParams', 'BASE_URL', 'modalSvc', '$q',
    function ($rootScope, $scope, mainSvc, actionSvc, modalSvc, $translate, $stateParams, BASE_URL, modalSvc, $q) {
      $scope.loadForm = false;
      $scope.editForm = [];
      $scope.paramId = 0;
      $scope.originalDataBD = [];
      $scope.languageData = {};
      $scope.pathLanguage = changeProtocolSSL(BASE_URL.api) + '/v1/common/viewFile?type=language&file=';
      $scope.viewLanguage = undefined;
      $scope.availableLanguages = [];

      $scope.loadLanguageForm = function() {
        let hashLang = getHash();
        $scope.paramId = $stateParams.id;

        /* Load Data */
        if ($scope.paramId) {
          mainSvc.callService({
              url: 'common/getListLanguages',
              params: {
                'menId': $scope.paramId
              }
          }).then(function (response) {
              $scope.availableLanguages = angular.copy(response);
              if (hashLang) {
                let objNode = $scope.availableLanguages.find(x => x.code == hashLang);
                if (objNode) $scope.viewLanguage = objNode.code;
                else $scope.viewLanguage = $scope.availableLanguages[0].code;
                setTimeout(function(){
                  document.body.scrollTop = document.documentElement.scrollTop = 0;
                },200);
              }
              else $scope.viewLanguage = $scope.availableLanguages[0].code;
          });

          mainSvc.callService({
              url: 'menu/getJsonLanguage',
              params: {
                'menId': $scope.paramId
              }
          }).then(function (response) {
            $scope.originalDataBD = angular.copy(response);
            $scope.loadFormByLanguage();
            $scope.loadForm = true;
          });
        }
        else {
          $scope.loadForm = true;
        };
      }

      $scope.loadFormByLanguage = function() {
        let lan = $scope.viewLanguage;
        $scope.languageData[lan] = [];
        angular.forEach($scope.originalDataBD, function(i, k){
          $scope.languageData[lan].push({
            'id': i.id,
            'value_original': i.value,
            'value_translate': i.value,
            'changed': 0
          });
        });

        let fileLanguage = $scope.pathLanguage + $rootScope.userInfo.id + '_' + lan + '.json&rand=' + Math.random();
        $.when($.get(fileLanguage))
        .done(function(languageSaved) {

          $scope.$apply(
            function() {
              angular.forEach(languageSaved, function(i, k){
                let objNode = $scope.languageData[lan].find(x => x.id == i.id);
                if (objNode) {
                  objNode['value_translate'] = i.value;
                  if (objNode['value_original']!=i.original) {
                    objNode['changed'] = 3;
                  }
                  else {
                    objNode['changed'] = 2;
                  };
                };
              });
            }
          );

        });
      }

      $scope.selectLanguage = function(lanCode) {
        $scope.viewLanguage = lanCode;
        $scope.loadFormByLanguage();
        setTimeout(function(){
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        },200);
      }

      $scope.submitForm = function() {
        let arrayData = [];
        angular.forEach($scope.languageData[$scope.viewLanguage], function(i, k){
          if (i.changed==1 || i.changed==2) {
            arrayData.push({
              'id': i.id,
              'value': i.value_translate,
              'original': i.value_original
            });
            i.changed = 2;
          };
        });
        mainSvc.callService({
            url: 'menu/saveJsonLanguage',
            params: {
              'menId': $scope.paramId,
              'lang': $scope.viewLanguage
            },
            data: {
              fields: {
                'json': JSON.stringify(arrayData)
              }
            },
            method: 'post'
        }).then(function (response) {
          $scope.editForm[$scope.viewLanguage] = false;
          mainSvc.showAlertByCode(1);
        });
      }

      $scope.clickResetForm = function() {
        modalSvc.showModal({
          size: 'sm'
        },{
          closeButtonText: $translate.instant('BTN_NO'),
          actionButtonText: $translate.instant('BTN_YES'),
          bodyText: $translate.instant('MSG_CANCEL_ACTION')
        }).then(function (result) {
          angular.forEach($scope.languageData[$scope.viewLanguage], function(i, k){
            if (i.changed==1) {
              i.value_translate = i.value_original;
              i.changed = 0;
            };
          });
          $scope.editForm[$scope.viewLanguage] = false;
        });
      }

      $scope.clickCancelForm = function() {
        let changedSomething = false;
        let txtTab = $translate.instant('MSG_PENDING_LANGUAGE');
        angular.forEach($scope.availableLanguages, function(a, b){
          if ($scope.editForm[b]) {
            changedSomething = true;
            txtTab+='<br/>- '+a.label;
          }
        });

        if (changedSomething) {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_CANCEL_ACTION') + txtTab
          }).then(function (result) {
            actionSvc.goToAction(12); //list menus
          });
        }
        else {
          actionSvc.goToAction(12); //list menus
        }
      }

      $scope.isEditingForm = function(item) {
        item.changed = 1;
        $scope.editForm[$scope.viewLanguage] = true;
      }

      $scope.clickNew = function() {
        mainSvc.callService({
            url: 'common/getListLanguages',
            params: {
              'menId': 0
            }
        }).then(function (response) {
          let lstLanguages = angular.copy(response);
          for (var t=lstLanguages.length-1;t>=0;t--) {
            let objNode = $scope.availableLanguages.find(x => x.code == lstLanguages[t].code);
            if (objNode) {
              lstLanguages.splice(t,1);
            };
          };

          if (lstLanguages.length>0) {
            modalSvc.showModal({
              templateUrl: '/templates/modals/modalNewLanguage.html'
            },
            {
                closeButtonText: undefined,
                defer: true,
                lstLanguages: lstLanguages,
                formData: {
                  lanCode: lstLanguages[0].code
                },
                beforeClose: function (scope) {
                  var defered = $q.defer();
                  var promise = defered.promise;

                  if (!scope.frmLanguage.$invalid) {
                    $('#frmLanguage').removeClass('was-validated');
                    let lanObj = lstLanguages.find(x => x.code == scope.modalOptions.formData.lanCode);
                    mainSvc.callService({
                        url: 'common/newLanguage',
                        params: {
                          'usrId': $rootScope.userInfo.id,
                          'menId': $scope.paramId,
                          'lanCode': lanObj.code
                        }
                    }).then(function (response) {
                      if (response.code==0) {
                        $scope.availableLanguages.push({
                          'id': $scope.availableLanguages.length,
                          'code': lanObj.code,
                          'label': lanObj.label
                        });
                        if ($scope.availableLanguages.length==1 && !$scope.viewLanguage) {
                          $scope.viewLanguage = $scope.availableLanguages[0].code;
                          $scope.selectLanguage($scope.viewLanguage);
                        };
                        mainSvc.showAlertByCode(1);
                        defered.resolve(true);
                      }
                      else {
                        mainSvc.showAlertByCode(300);
                        defered.resolve(false);
                      }
                    });
                  }
                  else {
                    $('#frmLanguage').addClass('was-validated');
                    scope.invalidForm = true;
                    mainSvc.showAlertByCode(103);
                    defered.resolve(false);
                  };
                  return promise;
                }
            });
          }
          else {
            mainSvc.showAlertByCode(112);
          }

        });
      }

      $scope.clickRemoveLanguage = function(idx) {
        modalSvc.showModal({
          size: 'sm'
        },{
          closeButtonText: $translate.instant('BTN_NO'),
          actionButtonText: $translate.instant('BTN_YES'),
          bodyText: $translate.instant('MSG_CONFIRM_ACTION')
        }).then(function (result) {
          mainSvc.callService({
              url: 'common/removeLanguage',
              params: {
                'usrId': $rootScope.userInfo.id,
                'menId': $scope.paramId,
                'lanCode': $scope.availableLanguages[idx].code
              }
          }).then(function (response) {
            if (response.code==0) {
              $scope.availableLanguages.splice(idx,1);
              if ($scope.availableLanguages.length>0) {
                $scope.viewLanguage = $scope.availableLanguages[0].code;
                $scope.selectLanguage($scope.viewLanguage);
              }
              else $scope.viewLanguage=undefined;
              mainSvc.showAlertByCode(1);
              defered.resolve(true);
            }
            else {
              mainSvc.showAlertByCode(300);
              defered.resolve(false);
            }
          });
        });
      }

  }]);
